import React from 'react';
import '../styles/TodoList.css';
import { STATUS_OPTIONS } from './TodoList';

const EditTodo = ({ editingTodo, editFormData, handleEditChange, editTodo, closeEditModal, error }) => {
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
                        {STATUS_OPTIONS.map(status => (
                            <option key={status} value={status}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                        ))}
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
};

export default EditTodo;
