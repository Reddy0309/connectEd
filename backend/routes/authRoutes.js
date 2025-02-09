//routes/authRoutes.js
import express from 'express';
import { registerUser, loginUser } from '../controllers/authcontroller.js';

const router = express.Router();

// Register a user (mentor/parent)
router.post('/register', registerUser);

// Login a user
router.post('/login', loginUser);

export default router;
