import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import '../styles/TodoList.css';

const STATUS_OPTIONS = ['not started', 'todo', 'in progress', 'done'];

const setCookie = (name, value, days = 7) => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
};

const getCookie = (name) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
};

const getOneWeekFromNow = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    const pad = (num) => num.toString().padStart(2, '0');
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const isOverdue = (dueTime) => {
    if (!dueTime) return false;
    try {
        const taskDueDate = new Date(dueTime);
        return taskDueDate < new Date();
    } catch {
        return false;
    }
};

const sortTodos = (todos) => todos.slice().sort((a, b) => new Date(a.due_time) - new Date(b.due_time));

const formatTime = (timestamp, prefix) => {
    if (!timestamp) return '';
    try {
        const date = new Date(timestamp);
        return `${prefix}: ${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } catch {
        return `${prefix}: Invalid Date`;
    }
};

const formatDueTimeForInput = (dueTime) => {
    if (!dueTime) return '';
    try {
        const [datePart, timePart] = dueTime.split(' ');
        if (!datePart || !timePart) return '';
        return `${datePart}T${timePart.substring(0, 5)}`;
    } catch {
        return '';
    }
};

const TodoCard = React.memo(({ todo, deleteTodo, updateStatus, openEditModal }) => {
    const isDone = todo.status === 'done';
    const isTaskOverdue = isOverdue(todo.due_time) && !isDone;
    const completedClass = isDone ? 'line-through done-task-text' : '';
    const statusClass = {
        done: 'done-task',
        'in progress': 'in-progress-task',
        todo: 'todo-task'
    }[todo.status] || '';

    const handleDragStart = (e) => e.dataTransfer.setData('todoId', todo.id);

    return (
        <div
            className={`todo-item ${isTaskOverdue ? 'overdue-task' : ''} ${statusClass}`}
            draggable
            onDragStart={handleDragStart}
        >
            <div className="card-content">
                <h3 className={completedClass}>{todo.title}</h3>
                <p className={completedClass}>{todo.description}</p>
                {isTaskOverdue && <p className="overdue-text-flag">OVERDUE</p>}
                <small className="card-small-text">{formatTime(todo.due_time, 'Due')}</small>
                <br />
                <small className="created-at-text card-small-text">{formatTime(todo.created_at, 'Created')}</small>
            </div>
            <div className="card-actions">
                <button onClick={() => openEditModal(todo)} className="edit-button">Edit</button>
                <button onClick={() => deleteTodo(todo.id)} className="delete-button">Remove</button>
            </div>
        </div>
    );
});

const KanbanColumn = React.memo(({ status, todos, updateStatus, deleteTodo, openEditModal }) => {
    const handleDrop = (e) => {
        e.preventDefault();
        const todoId = e.dataTransfer.getData('todoId');
        if (todoId) updateStatus(parseInt(todoId, 10), status);
    };
    const handleDragOver = (e) => e.preventDefault();
    const displayHeader = {
        'not started': 'Ideas',
        todo: 'To Do',
        'in progress': 'In Progress',
        done: 'Done'
    }[status] || status;

    return (
        <div className={`kanban-column ${status.replace(/\s/g, '-')}`} onDrop={handleDrop} onDragOver={handleDragOver}>
            <h2>{displayHeader} ({todos.length})</h2>
            <div className="column-tasks">
                {todos.map(todo => (
                    <TodoCard key={todo.id} todo={todo} updateStatus={updateStatus} deleteTodo={deleteTodo} openEditModal={openEditModal} />
                ))}
            </div>
        </div>
    );
});

const EditTodoModal = React.memo(({ editingTodo, editFormData, handleEditChange, editTodo, closeEditModal, error }) => {
    if (!editingTodo) return null;
    return (
        <div className="modal-overlay" onClick={closeEditModal}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2>Edit Task: {editingTodo.title}</h2>
                <form onSubmit={editTodo} className="edit-todo-form">
                    <label>Title</label>
                    <input type="text" name="title" value={editFormData.title || ''} onChange={handleEditChange} required />
                    <label>Description</label>
                    <textarea name="description" value={editFormData.description || ''} onChange={handleEditChange} />
                    <label>Due Date</label>
                    <input type="datetime-local" name="dueDate" value={editFormData.dueDate || ''} onChange={handleEditChange} />
                    <label>Status</label>
                    <select name="status" value={editFormData.status || 'not started'} onChange={handleEditChange}>
                        {STATUS_OPTIONS.map(status => <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>)}
                    </select>
                    {error && <p className="modal-error">{error}</p>}
                    <div className="modal-actions">
                        <button type="button" onClick={closeEditModal} className="cancel-button">Cancel</button>
                        <button type="submit" className="save-button">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
});

function TodoList({ userId }) {
    const [todos, setTodos] = useState([]);
    const [editingTodo, setEditingTodo] = useState(null);
    const [editFormData, setEditFormData] = useState({ title: '', description: '', dueDate: '', status: 'not started' });
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [newTodoState, setNewTodoState] = useState({ title: '', description: '', dueDate: '' });
    const [verticalLayout, setVerticalLayout] = useState(false);

    useEffect(() => {
        const fetchTodos = async () => {
            const token = getCookie('token');
            if (!token) return;
            try {
                const res = await axios.get('http://localhost:8080/todos', { headers: { Authorization: `Bearer ${token}` } });
                if (Array.isArray(res.data)) setTodos(sortTodos(res.data));
            } catch (err) {
                console.error(err);
            }
        };
        fetchTodos();
    }, []);

    const openEditModal = useCallback((todo) => {
        setEditingTodo(todo);
        setEditFormData({
            title: todo.title || '',
            description: todo.description || '',
            dueDate: formatDueTimeForInput(todo.due_time),
            status: todo.status || 'not started'
        });
        setError('');
    }, []);

    const closeEditModal = useCallback(() => {
        setEditingTodo(null);
        setEditFormData({ title: '', description: '', dueDate: '', status: 'not started' });
    }, []);

    const handleEditChange = useCallback((e) => {
        const { name, value } = e.target;
        setEditFormData(f => ({ ...f, [name]: value }));
    }, []);

    const editTodo = useCallback(async (e) => {
        e.preventDefault();
        if (!editingTodo) return;
        setError('');
        const token = getCookie('token');
        const todoId = editingTodo.id;
        if (!editFormData.title) return setError("Title cannot be empty.");

        const effectiveDueTime = editFormData.dueDate ? editFormData.dueDate.replace('T', ' ') + ':00' : getOneWeekFromNow();
        const updatePayload = { title: editFormData.title, description: editFormData.description, status: editFormData.status, due_time: effectiveDueTime };

        try {
            const res = await axios.put(`http://localhost:8080/todos/${todoId}`, updatePayload, { headers: { Authorization: `Bearer ${token}` } });
            const updatedTodo = res.data.id ? res.data : { ...editingTodo, ...updatePayload };
            setTodos(todos => sortTodos(todos.map(todo => (todo.id === todoId ? updatedTodo : todo))));
            closeEditModal();
        } catch (err) {
            setError(`Failed to update todo: ${err.response?.data?.message || err.message}`);
        }
    }, [editingTodo, editFormData, closeEditModal]);

    const addTodo = useCallback(async (e) => {
        e.preventDefault();
        setError('');
        const token = getCookie('token');
        if (!newTodoState.title) return setError("Title cannot be empty.");

        const effectiveDueTime = newTodoState.dueDate ? newTodoState.dueDate.replace('T', ' ') + ':00' : getOneWeekFromNow();
        const todoPayload = { title: newTodoState.title, description: newTodoState.description, userId, status: 'not started', due_time: effectiveDueTime };

        try {
            const res = await axios.post('http://localhost:8080/todos', todoPayload, { headers: { Authorization: `Bearer ${token}` } });
            if (res.data?.id) {
                setTodos(todos => sortTodos([...todos, res.data]));
                setNewTodoState({ title: '', description: '', dueDate: '' });
            } else setError("Invalid response from server.");
        } catch (err) {
            setError(`Failed to add todo: ${err.response?.data?.message || err.message}`);
        }
    }, [newTodoState, userId]);

    const updateStatus = useCallback(async (id, newStatus) => {
        const token = getCookie('token');
        setTodos(todos => todos.map(todo => (todo.id === id ? { ...todo, status: newStatus } : todo)));
        try {
            await axios.put(`http://localhost:8080/todos/${id}`, { status: newStatus }, { headers: { Authorization: `Bearer ${token}` } });
        } catch (err) {
            setError(`Failed to update status: ${err.response?.data?.message || err.message}`);
        }
    }, []);

    const deleteTodo = useCallback(async (id) => {
        const token = getCookie('token');
        if (!window.confirm("Are you sure you want to delete this task?")) return;
        try {
            await axios.delete(`http://localhost:8080/todos/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            setTodos(todos => todos.filter(todo => todo.id !== id));
        } catch (err) {
            setError(`Failed to delete todo: ${err.response?.data?.message || err.message}`);
        }
    }, []);

    const filteredTodos = useMemo(() => {
        return todos.filter(todo =>
            todo.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            todo.description?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [todos, searchQuery]);

    const groupedTodos = useMemo(() => {
        return filteredTodos.reduce((acc, todo) => {
            const status = todo.status || 'not started';
            if (!acc[status]) acc[status] = [];
            acc[status].push(todo);
            return acc;
        }, {});
    }, [filteredTodos]);

    return (
        <div className={`kanban-board-container ${verticalLayout ? 'vertical-layout' : ''}`}>
            <button
                style={{ marginBottom: '20px', padding: '8px 12px', cursor: 'pointer' }}
                onClick={() => setVerticalLayout(v => !v)}
            >
                Switch to {verticalLayout ? 'Horizontal' : 'Vertical'} Layout
            </button>

            {error && <p className="global-error-message">{error}</p>}

            <div className="controls-and-form">
                <input type="text" placeholder="Search tasks..." className="search-input" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                <form onSubmit={addTodo} className="add-todo-form">
                    <input type="text" placeholder="Title (Required)" value={newTodoState.title} onChange={e => setNewTodoState(s => ({ ...s, title: e.target.value }))} required />
                    <textarea placeholder="Description (Optional)" value={newTodoState.description} onChange={e => setNewTodoState(s => ({ ...s, description: e.target.value }))} />
                    <input type="datetime-local" title="Due Date and Time" value={newTodoState.dueDate} onChange={e => setNewTodoState(s => ({ ...s, dueDate: e.target.value }))} />
                    <button type="submit">Add Task</button>
                </form>
            </div>

            <div className="kanban-board">
                {STATUS_OPTIONS.map(status => (
                    <KanbanColumn key={status} status={status} todos={groupedTodos[status] || []} updateStatus={updateStatus} deleteTodo={deleteTodo} openEditModal={openEditModal} />
                ))}
                {Object.keys(groupedTodos).filter(s => !STATUS_OPTIONS.includes(s)).map(status => (
                    <KanbanColumn key={status} status={status} todos={groupedTodos[status] || []} updateStatus={updateStatus} deleteTodo={deleteTodo} openEditModal={openEditModal} />
                ))}
            </div>

            <EditTodoModal
                editingTodo={editingTodo}
                editFormData={editFormData}
                handleEditChange={handleEditChange}
                editTodo={editTodo}
                closeEditModal={closeEditModal}
                error={error}
            />
        </div>
    );
}

export default TodoList;
