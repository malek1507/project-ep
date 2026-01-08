import db from "../../config/db.js";

export async function getTodosByUserId(userId) {
    const [rows] = await db.query(
        "SELECT id, title, description, due_time, status, created_at FROM todo WHERE user_id = ?",
        [userId]
    );
    return rows;
}

export async function createTodo({ title, description, due_time, userId }) {
    const [result] = await db.query(
        "INSERT INTO todo (title, description, due_time, user_id) VALUES (?, ?, ?, ?)",
        [title, description, due_time, userId]
    );

    const [newTodo] = await db.query(
        "SELECT id, title, description, due_time, status, created_at FROM todo WHERE id = ?",
        [result.insertId]
    );

    return newTodo[0];
}

export async function updateTodoStatus(todoId, userId, newStatus) {
    const [result] = await db.query(
        "UPDATE todo SET status = ? WHERE id = ? AND user_id = ?",
        [newStatus, todoId, userId]
    );
    return result.affectedRows === 1;
}

export async function deleteTodo(todoId, userId) {
    const [result] = await db.query(
        "DELETE FROM todo WHERE id = ? AND user_id = ?",
        [todoId, userId]
    );

    return result.affectedRows === 1;
}