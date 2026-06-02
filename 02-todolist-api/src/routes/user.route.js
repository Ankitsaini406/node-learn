import { Router } from "express";
import { login, logout, refreshAccessToken, register } from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/jwt.middleware.js";

const router = Router();

router.post('/register', register);

router.post("/login", login);

router.post("/logout", verifyToken, logout);

router.post("/refresh-token", refreshAccessToken);

export default router;