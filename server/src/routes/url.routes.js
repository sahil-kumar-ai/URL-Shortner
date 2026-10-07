import express from 'express';
import { createShortUrl, deleteUrl, getAllUrls } from '../controller/url.controller.js';

const router = express.Router();

router.post('/create', createShortUrl);
router.get('/', getAllUrls);
router.delete('/delete/:id', deleteUrl);

export default router;