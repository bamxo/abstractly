import { Router } from 'express';
import { signup, login, getCurrentUser, verifyToken } from '../controllers/authController.js';

const router = Router();

// Auth routes
router.post('/signup', signup);
router.post('/login', login);
router.get('/user', getCurrentUser);
router.post('/verify-token', verifyToken);

export default router; 