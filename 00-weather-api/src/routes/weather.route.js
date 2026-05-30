
import { Router } from "express";
import { getWeather } from "../controllers/weather.controller.js";
import { asyncHandler } from "../utils/utils.js";

const router = Router();

router.get("/", asyncHandler(getWeather));

export default router;