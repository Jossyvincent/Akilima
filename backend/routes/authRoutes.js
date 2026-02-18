import express from "express";
import { register, login, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// all this are endpoints are tested and are working as expected
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

export default router