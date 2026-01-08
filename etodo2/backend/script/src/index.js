import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth/auth.js";
import todoRoutes from "./routes/todos/todos.js";
import userRoutes from "./routes/user/user.js";
import notFound from "./middleware/notFound.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
});

console.log("authRoutes type:", typeof authRoutes);

app.use("/auth", authRoutes);
app.use("/todos", todoRoutes);
app.use("/user", userRoutes);

app.use(notFound);

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));