import { Router } from 'express';
import { generateShortUrl, getShortUrl } from '../controllers/url.controller.js';

const router = Router();

router.post('/create', generateShortUrl);
router.get('/:id', getShortUrl);

export default router;