import express from "express";
import auth from "../../middleware/auth.js";
import * as todoQueries from "./todos.query.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {
    try {
        const todos = await todoQueries.getTodosByUserId(req.user.id);
        res.json(todos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error fetching todos" });
    }
});

router.post("/", auth, async (req, res) => {
    try {
        const { title, description, due_time } = req.body;
        const userId = req.user.id;

        if (!title || !description || !due_time) {
            return res.status(400).json({ message: "Missing fields" });
        }

        const newTodo = await todoQueries.createTodo({ title, description, due_time, userId });

        res.status(201).json(newTodo);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error creating todo" });
    }
});

router.put("/:id", auth, async (req, res) => {
    try {
        const todoId = req.params.id;
        const userId = req.user.id;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ message: "Missing status field" });
        }

        const updated = await todoQueries.updateTodoStatus(todoId, userId, status);

        if (!updated) {
            return res.status(404).json({ message: "Todo not found or unauthorized" });
        }

        res.status(200).json({ message: "Status updated successfully", status });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error updating status" });
    }
});


router.delete("/:id", auth, async (req, res) => {
    try {
        const todoId = req.params.id;
        const userId = req.user.id;

        const deleted = await todoQueries.deleteTodo(todoId, userId);

        if (!deleted) {
            return res.status(404).json({ message: "Todo not found or unauthorized" });
        }

        res.status(204).send();

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error deleting todo" });
    }
});

export default router;