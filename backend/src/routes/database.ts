import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();

// Initialize Prisma client inside handlers for serverless compatibility
function getPrismaClient() {
  return new PrismaClient();
}

// GET /api/database/init - Initialize database tables
router.get('/init', async (req, res) => {
  const prisma = getPrismaClient();
  try {
    // Test database connection
    await prisma.$connect();
    
    // Try to query the database to see if tables exist
    const userCount = await prisma.user.count();
    const productCount = await prisma.product.count();
    
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
      error: error.message 
    });
  } finally {
    await prisma.$disconnect();
  }
});

// GET /api/database/seed - Seed database with initial data
router.get('/seed', async (req, res) => {
  const prisma = getPrismaClient();
  try {
    // Create demo user
    const demoUser = await prisma.user.upsert({
      where: { email: 'demo@localcafe.com' },
      update: {},
      create: {
        email: 'demo@localcafe.com',
        password: 'hashedpassword', // In real app, this would be properly hashed
        firstName: 'Demo',
        lastName: 'User',
      },
    });

    // Sample products data
    const products = [
      {
        name: 'Espresso',
        description: 'Rich and bold espresso shot',
        category: 'coffee',
        price: 2.50,
        imageUrl: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400&h=300&fit=crop',
      },
      {
        name: 'Cappuccino',
        description: 'Espresso with steamed milk and foam',
        category: 'coffee',
        price: 4.00,
        imageUrl: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop',
      },
      {
        name: 'Latte',
        description: 'Smooth espresso with steamed milk',
        category: 'coffee',
        price: 4.50,
        imageUrl: 'https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=400&h=300&fit=crop',
      },
      {
        name: 'Americano',
        description: 'Espresso with hot water',
        category: 'coffee',
        price: 3.00,
        imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=300&fit=crop',
      },
      {
        name: 'Mocha',
        description: 'Espresso with chocolate and steamed milk',
        category: 'coffee',
        price: 5.00,
        imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      },
      {
        name: 'Green Tea',
        description: 'Fresh brewed green tea',
        category: 'tea',
        price: 2.00,
        imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop',
      },
      {
        name: 'Earl Grey',
        description: 'Classic black tea with bergamot',
        category: 'tea',
        price: 2.50,
        imageUrl: 'https://images.unsplash.com/photo-1597318181409-cf64d0b3754d?w=400&h=300&fit=crop',
      },
      {
        name: 'Chamomile Tea',
        description: 'Soothing herbal tea',
        category: 'tea',
        price: 2.25,
        imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop',
      },
      {
        name: 'Blueberry Muffin',
        description: 'Fresh baked muffin with blueberries',
        category: 'pastry',
        price: 3.50,
        imageUrl: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=400&h=300&fit=crop',
      },
      {
        name: 'Chocolate Croissant',
        description: 'Buttery croissant with chocolate filling',
        category: 'pastry',
        price: 4.00,
        imageUrl: 'https://images.unsplash.com/photo-1555507036-ab794f4afe5e?w=400&h=300&fit=crop',
      }
    ];

    // Create products if they don't exist
    for (const product of products) {
      await prisma.product.upsert({
        where: { name: product.name },
        update: {},
        create: product,
      });
    }

    res.json({ 
      success: true, 
      message: 'Database seeded successfully',
      data: { demoUserId: demoUser.id, productsCount: products.length }
    });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to seed database',
      error: error.message 
    });
  } finally {
    await prisma.$disconnect();
  }
});

export default router;