import { Router } from "express";
import { login, logout, register } from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/jwt.middleware.js";

const router = Router();

router.post('/register', register);

router.post("/login", login);

router.post("/logout", verifyToken, logout);

export default router;