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

// GET /api/products/categories - Get all product categories
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