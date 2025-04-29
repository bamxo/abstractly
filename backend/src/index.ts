/// <reference types="vite/client" />
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Basic test route
app.get('/', (req: express.Request, res: express.Response) => {
  res.json({ message: 'Backend server is running!' });
});

if (import.meta.env.PROD) {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

export { app }; 