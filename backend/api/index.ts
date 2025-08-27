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
  res.json({ status: 'OK', message: 'Local Café API is running' });
});

// Migration endpoint - Create tables using Prisma schema
app.get('/api/migrate', async (req, res) => {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    // Execute raw SQL to create tables based on Prisma schema
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "User" (
        "id" SERIAL PRIMARY KEY,
        "email" TEXT NOT NULL UNIQUE,
        "password" TEXT NOT NULL,
        "name" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Product" (
        "id" SERIAL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "price" DECIMAL(10,2) NOT NULL,
        "category" TEXT NOT NULL,
        "imageUrl" TEXT,
        "available" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Order" (
        "id" SERIAL PRIMARY KEY,
        "userId" INTEGER NOT NULL,
        "total" DECIMAL(10,2) NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'pending',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
      );
    `;
    
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "OrderItem" (
        "id" SERIAL PRIMARY KEY,
        "orderId" INTEGER NOT NULL,
        "productId" INTEGER NOT NULL,
        "quantity" INTEGER NOT NULL,
        "price" DECIMAL(10,2) NOT NULL,
        FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
        FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE
      );
    `;
    
    await prisma.$disconnect();
    
    res.json({ 
      success: true, 
      message: 'Database tables created successfully'
    });
  } catch (error) {
    console.error('Migration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Migration failed', 
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
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

// Database initialization and seeding endpoint
app.get('/api/database/init', async (req, res) => {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    // Test database connection
    await prisma.$connect();
    
    // Try to query the database to see if tables exist
    const userCount = await prisma.user.count();
    const productCount = await prisma.product.count();
    
    await prisma.$disconnect();
    
    res.json({ 
      success: true, 
      message: 'Database connection successful',
      data: { userCount, productCount }
    });
  } catch (error) {
    console.error('Database init error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Database seeding endpoint
app.post('/api/database/seed', async (req, res) => {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    await prisma.$connect();
    
    // Check if products already exist
    const existingProducts = await prisma.product.count();
    if (existingProducts > 0) {
      await prisma.$disconnect();
      return res.json({ 
        success: true, 
        message: 'Database already seeded',
        data: { productCount: existingProducts }
      });
    }
    
    // Seed products
    const products = [
      {
        name: 'Espresso',
        description: 'Rich and bold espresso shot',
        category: 'Coffee',
        price: 2.50,
        imageUrl: '/images/espresso.jpg',
        available: true
      },
      {
        name: 'Cappuccino',
        description: 'Espresso with steamed milk and foam',
        category: 'Coffee',
        price: 4.00,
        imageUrl: '/images/cappuccino.jpg',
        available: true
      },
      {
        name: 'Latte',
        description: 'Espresso with steamed milk',
        category: 'Coffee',
        price: 4.50,
        imageUrl: '/images/latte.jpg',
        available: true
      },
      {
        name: 'Croissant',
        description: 'Buttery, flaky pastry',
        category: 'Pastry',
        price: 3.00,
        imageUrl: '/images/croissant.jpg',
        available: true
      }
    ];
    
    await prisma.product.createMany({ data: products });
    
    const productCount = await prisma.product.count();
    
    await prisma.$disconnect();
    
    res.json({ 
      success: true, 
      message: 'Database seeded successfully',
      data: { productCount }
    });
  } catch (error) {
    console.error('Database seed error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Database seeding failed',
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
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