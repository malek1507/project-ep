import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../../config/db.js";

const router = express.Router();

console.log("✅ Auth router loaded");

router.get("/register", (req, res) => {
    return res.json({ message: "Send a POST to /auth/register with { email, password, name, firstname }" });
});

router.get("/login", (req, res) => {
    return res.json({ message: "Send a POST to /auth/login with { email, password }" });
});

router.post("/register", async (req, res) => {
    try {
        const { email, password, name, firstname } = req.body;

        if (!email || !password || !name || !firstname) {
            return res.status(400).json({ message: "Missing fields" });
        }

        const [existingUser] = await db.query("SELECT * FROM user WHERE email = ?", [email]);
        if (existingUser.length > 0) {
            return res.status(409).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.query(
            "INSERT INTO user (email, password, name, firstname) VALUES (?, ?, ?, ?)",
            [email, hashedPassword, name, firstname]
        );

        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Missing fields" });
        }

        const [users] = await db.query("SELECT * FROM user WHERE email = ?", [email]);
        if (users.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = users[0];
        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ message: "Login successful", token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;