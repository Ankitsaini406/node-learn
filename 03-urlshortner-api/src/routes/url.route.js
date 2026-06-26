import { Router } from 'express';
import { generateShortUrl, getShortUrl, getUrlStatistics, updateShortUrl, deleteShortUrl } from '../controllers/url.controller.js';

const router = Router();

router.post("/", generateShortUrl);

router.get("/stats/:id", getUrlStatistics);

router.put("/:id", updateShortUrl);

router.delete("/:id", deleteShortUrl);

router.get("/:id", getShortUrl);

export default router;