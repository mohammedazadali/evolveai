import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoute.js';
import chatRoutes from './routes/chatRoutes.js';

dotenv.config();
const app = express();

// ✅ Enable CORS for your frontend origin
app.use(cors({
  origin: ['http://localhost:3000', 'https://evolveai-4.onrender.com'], // allow both frontend dev & deployed URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

connectDB();

app.use('/api/chat', chatRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || process.env.X_ZOHO_CATALYST_LISTEN_PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
