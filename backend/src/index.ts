import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import { authMiddleware, AuthRequest } from './middleware/auth.js';

dotenv.config();

export const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Basic test route
app.get('/', (req, res) => {
  res.json({ message: 'Backend server is running!' });
});

// Auth routes
app.use('/auth', authRoutes);

// Protected routes example
app.get('/protected', authMiddleware, (req: AuthRequest, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 