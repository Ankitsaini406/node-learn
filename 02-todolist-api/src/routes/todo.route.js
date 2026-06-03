import { Router } from "express";
import { createTodo, deleteTodo, getTodosList, updateTodo } from "../controllers/todo.controller.js";
import { verifyToken } from "../middleware/jwt.middleware.js";

const router = Router();

router.get("/all", verifyToken, getTodosList);
router.post("/create", verifyToken, createTodo);
router.post("/update/:id", verifyToken, updateTodo);
router.delete("/delete/:id", verifyToken, deleteTodo);

export default router;