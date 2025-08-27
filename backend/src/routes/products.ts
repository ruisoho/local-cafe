import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();

// Initialize Prisma client inside handlers for serverless compatibility
function getPrismaClient() {
  return new PrismaClient();
}



// GET /api/products - Get all products
router.get('/', async (req, res) => {
  const prisma = getPrismaClient();
  try {
    const { category } = req.query;
    
    const where = category ? { category: category as string } : {};
    
    const products = await prisma.product.findMany({
      where: {
        available: true,
        ...where,
      },
      orderBy: {
        category: 'asc',
      },
    });

    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
    });
  } finally {
    await prisma.$disconnect();
  }
});

// GET /api/products/categories - Get all unique categories
router.get('/categories', async (req, res) => {
  const prisma = getPrismaClient();
  try {
    const categories = await prisma.product.findMany({
      where: {
        available: true,
      },
      select: {
        category: true,
      },
      distinct: ['category'],
    });

    const categoryNames = categories.map(cat => cat.category);

    res.json({
      success: true,
      data: categoryNames,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
    });
  } finally {
    await prisma.$disconnect();
  }
});

// Seed database route
router.get('/seed', async (req, res) => {
  const prisma = getPrismaClient();
  try {
    const bcrypt = require('bcryptjs');
    
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

    res.json({ success: true, message: 'Database seeded successfully' });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ success: false, message: 'Failed to seed database' });
  } finally {
    await prisma.$disconnect();
  }
});

// GET /api/products/:id - Get single product
router.get('/:id', async (req, res) => {
  const prisma = getPrismaClient();
  try {
    const { id } = req.params;
    
    const product = await prisma.product.findUnique({
      where: {
        id: parseInt(id),
        available: true,
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
    });
  } finally {
    await prisma.$disconnect();
  }
});

export default router;