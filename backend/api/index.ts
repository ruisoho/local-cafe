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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Seed database endpoint
app.get('/api/seed', async (req, res) => {
  try {
    const { PrismaClient } = require('@prisma/client');
    const bcrypt = require('bcryptjs');
    const prisma = new PrismaClient();

    // Create demo user
    const demoUserEmail = 'demo@localcafe.com';
    const demoUserExists = await prisma.user.findUnique({
      where: { email: demoUserEmail },
    });

    if (!demoUserExists) {
      const hashedPassword = await bcrypt.hash('demo123', 12);
      await prisma.user.create({
        data: {
          email: demoUserEmail,
          password: hashedPassword,
          firstName: 'Demo',
          lastName: 'User',
          phone: '+1-555-DEMO',
        },
      });
    }

    // Sample products
    const products = [
      {
        name: 'Espresso',
        description: 'Rich and bold single shot espresso',
        category: 'coffee',
        price: 2.30,
        imageUrl: 'https://images.unsplash.com/photo-1610889556528-9a770e32642f?w=400&h=300&fit=crop',
      },
      {
        name: 'Cappuccino',
        description: 'Espresso with steamed milk and foam',
        category: 'coffee',
        price: 3.90,
        imageUrl: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop',
      },
      {
        name: 'Croissant',
        description: 'Buttery, flaky French pastry',
        category: 'pastry',
        price: 2.50,
        imageUrl: 'https://images.unsplash.com/photo-1555507036-ab794f4afe5e?w=400&h=300&fit=crop',
      }
    ];

    // Create products if they don't exist
    for (const product of products) {
      const exists = await prisma.product.findFirst({
        where: { name: product.name }
      });
      if (!exists) {
        await prisma.product.create({ data: product });
      }
    }

    await prisma.$disconnect();
    res.json({ success: true, message: 'Database seeded successfully' });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ success: false, message: 'Failed to seed database' });
  }
});

// Routes
app.use('/api/products', productsRouter);
app.use('/api/auth', authRouter);

// Catch all handler for non-API routes
app.get('/', (req, res) => {
  res.json({ status: 'OK', message: 'Local Café API is running' });
});

export default app;