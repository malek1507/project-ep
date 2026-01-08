import db from "../../config/db.js";

export async function getUserById(id) {
    const [rows] = await db.query("SELECT id, email, name, firstname, created_at FROM user WHERE id = ?", [id]);
    return rows[0];
}
