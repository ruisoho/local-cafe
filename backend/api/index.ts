import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productsRouter from '../src/routes/products';
import authRouter from '../src/routes/auth';

dotenv.config();

const app = express();

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001', 
  'http://localhost:3003',
  'http://localhost:3004',
  process.env.FRONTEND_URL,
  // Add your Vercel frontend domain here
  'https://your-frontend-domain.vercel.app'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Allow any vercel.app domain in development
    if (origin && origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Local Café API is running' });
});

app.use('/api/products', productsRouter);
app.use('/api/auth', authRouter);

// Catch all handler for non-API routes
app.get('/', (req, res) => {
  res.json({ status: 'OK', message: 'Local Café API is running' });
});

export default app;