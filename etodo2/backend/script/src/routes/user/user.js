import express from "express";
import auth from "../../middleware/auth.js";
import db from "../../config/db.js";

const router = express.Router();

router.get("/profile", auth, async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT id, email, name, firstname, created_at FROM user WHERE id = ?",
            [req.user.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "User not found." });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

router.put("/profile", auth, async (req, res) => {
    const { name, firstname, email } = req.body;

    try {
        await db.query(
            "UPDATE user SET name = ?, firstname = ?, email = ? WHERE id = ?",
            [name, firstname, email, req.user.id]
        );
        res.json({ message: "Profile updated successfully." });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

router.delete("/profile", auth, async (req, res) => {
    try {
        await db.query("DELETE FROM user WHERE id = ?", [req.user.id]);
        res.json({ message: "Profile deleted successfully." });
    } catch (error) {
        console.error("Error deleting profile:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

export default router;
