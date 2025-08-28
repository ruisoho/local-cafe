import { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';

const prisma = new PrismaClient();

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.vercel.app'] 
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Helper function to handle CORS
function handleCors(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin;
  const allowedOrigins = corsOptions.origin as string[];
  
  if (allowedOrigins.includes(origin || '')) {
    res.setHeader('Access-Control-Allow-Origin', origin || '');
  }
  
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', corsOptions.methods.join(', '));
  res.setHeader('Access-Control-Allow-Headers', corsOptions.allowedHeaders.join(', '));
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }
  return false;
}

// JWT verification middleware
function verifyToken(token: string) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
  } catch (error) {
    return null;
  }
}

// Main handler function
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS
  if (handleCors(req, res)) return;

  const { method, url } = req;
  const path = url?.split('?')[0] || '';

  try {
    // Health check
    if (path === '/api' && method === 'GET') {
      return res.status(200).json({ 
        message: 'Local Café API is running!', 
        timestamp: new Date().toISOString() 
      });
    }

    // Authentication routes
    if (path === '/api/auth/register' && method === 'POST') {
      const { email, firstName, lastName, phone, password } = req.body;
      
      if (!email || !firstName || !lastName || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          phone,
          password: hashedPassword,
        },
      });

      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '7d' }
      );

      const { password: _, ...userWithoutPassword } = user;
      return res.status(201).json({ user: userWithoutPassword, token });
    }

    if (path === '/api/auth/login' && method === 'POST') {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
      }

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !await bcrypt.compare(password, user.password)) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '7d' }
      );

      const { password: _, ...userWithoutPassword } = user;
      return res.status(200).json({ user: userWithoutPassword, token });
    }

    // Categories routes
    if (path === '/api/categories' && method === 'GET') {
      const categories = await prisma.category.findMany({
        where: { isActive: true },
        include: { products: { where: { isAvailable: true } } },
        orderBy: { name: 'asc' },
      });
      return res.status(200).json(categories);
    }

    // Products routes
    if (path === '/api/products' && method === 'GET') {
      const { categoryId } = req.query;
      const products = await prisma.product.findMany({
        where: {
          isAvailable: true,
          ...(categoryId && { categoryId: categoryId as string }),
        },
        include: { category: true },
        orderBy: { name: 'asc' },
      });
      return res.status(200).json(products);
    }

    if (path.startsWith('/api/products/') && method === 'GET') {
      const productId = path.split('/')[3];
      const product = await prisma.product.findUnique({
        where: { id: productId },
        include: { category: true },
      });
      
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      return res.status(200).json(product);
    }

    // Orders routes (protected)
    if (path === '/api/orders' && method === 'POST') {
      const authHeader = req.headers.authorization;
      const token = authHeader?.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }

      const decoded = verifyToken(token) as any;
      if (!decoded) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      const { items, notes } = req.body;
      
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Order items required' });
      }

      // Calculate total price
      let totalPrice = 0;
      const orderItems = [];
      
      for (const item of items) {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });
        
        if (!product || !product.isAvailable) {
          return res.status(400).json({ error: `Product ${item.productId} not available` });
        }
        
        const itemTotal = Number(product.price) * item.quantity;
        totalPrice += itemTotal;
        
        orderItems.push({
          productId: item.productId,
          quantity: item.quantity,
          price: product.price,
        });
      }

      const order = await prisma.order.create({
        data: {
          userId: decoded.userId,
          totalPrice,
          notes,
          orderItems: {
            create: orderItems,
          },
        },
        include: {
          orderItems: {
            include: { product: true },
          },
        },
      });

      return res.status(201).json(order);
    }

    if (path === '/api/orders' && method === 'GET') {
      const authHeader = req.headers.authorization;
      const token = authHeader?.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }

      const decoded = verifyToken(token) as any;
      if (!decoded) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      const orders = await prisma.order.findMany({
        where: { userId: decoded.userId },
        include: {
          orderItems: {
            include: { product: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return res.status(200).json(orders);
    }

    // User profile route (protected)
    if (path === '/api/user/profile' && method === 'GET') {
      const authHeader = req.headers.authorization;
      const token = authHeader?.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }

      const decoded = verifyToken(token) as any;
      if (!decoded) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          createdAt: true,
        },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json(user);
    }

    // Route not found
    return res.status(404).json({ error: 'Route not found' });
    
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  } finally {
    await prisma.$disconnect();
  }
}