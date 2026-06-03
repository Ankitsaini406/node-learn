import { Router } from "express";
import { createTodo, updateTodo } from "../controllers/todo.controller.js";
import { verifyToken } from "../middleware/jwt.middleware.js";

const router = Router();

router.post("/create", verifyToken, createTodo);
router.post("/update/:id", verifyToken, updateTodo);

export default router;