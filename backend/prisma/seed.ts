import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

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
    console.log('👤 Created demo user: demo@localcafe.com / demo123');
  }

  // Create sample products (prices in Euros)
  const products = [
    // Coffee
    {
      name: 'Espresso',
      description: 'Rich and bold single shot espresso',
      category: 'coffee',
      price: 2.30,
      imageUrl: 'https://images.unsplash.com/photo-1610889556528-9a770e32642f?w=400&h=300&fit=crop',
    },
    {
      name: 'Americano',
      description: 'Espresso with hot water for a smooth, rich coffee',
      category: 'coffee',
      price: 2.80,
      imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop',
    },
    {
      name: 'Cappuccino',
      description: 'Espresso with steamed milk and foam',
      category: 'coffee',
      price: 3.90,
      imageUrl: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop',
    },
    {
      name: 'Latte',
      description: 'Espresso with steamed milk and light foam',
      category: 'coffee',
      price: 4.35,
      imageUrl: 'https://images.unsplash.com/photo-1561047029-3000c68339ca?w=400&h=300&fit=crop',
    },
    {
      name: 'Mocha',
      description: 'Espresso with chocolate and steamed milk',
      category: 'coffee',
      price: 4.80,
      imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    },
    {
      name: 'Cold Brew',
      description: 'Smooth, cold-extracted coffee served over ice',
      category: 'coffee',
      price: 3.45,
      imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400&h=300&fit=crop',
    },

    // Pastries
    {
      name: 'Croissant',
      description: 'Buttery, flaky French pastry',
      category: 'pastries',
      price: 3.20,
      imageUrl: 'https://images.unsplash.com/photo-1555507036-ab794f575ca7?w=400&h=300&fit=crop',
    },
    {
      name: 'Pain au Chocolat',
      description: 'Classic French chocolate pastry',
      category: 'pastries',
      price: 3.65,
      imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop',
    },
    {
      name: 'Blueberry Scone',
      description: 'Traditional British scone with fresh blueberries',
      category: 'pastries',
      price: 3.45,
      imageUrl: 'https://images.unsplash.com/photo-1519869325930-281384150729?w=400&h=300&fit=crop',
    },
    {
      name: 'Almond Danish',
      description: 'Flaky pastry with sweet almond filling',
      category: 'pastries',
      price: 3.90,
      imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
    },

    // Cakes
    {
      name: 'Chocolate Cake',
      description: 'Decadent three-layer chocolate cake',
      category: 'cakes',
      price: 5.95,
      imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
    },
    {
      name: 'Carrot Cake',
      description: 'Moist carrot cake with cream cheese frosting',
      category: 'cakes',
      price: 5.25,
      imageUrl: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400&h=300&fit=crop',
    },
    {
      name: 'Red Velvet Cake',
      description: 'Classic red velvet with vanilla buttercream',
      category: 'cakes',
      price: 5.75,
      imageUrl: 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=400&h=300&fit=crop',
    },
    {
      name: 'Tiramisu',
      description: 'Traditional Italian coffee-flavored dessert',
      category: 'cakes',
      price: 6.45,
      imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop',
    },

    // Sandwiches
    {
      name: 'Croque Monsieur',
      description: 'Classic French grilled ham and cheese sandwich',
      category: 'sandwiches',
      price: 6.90,
      imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop',
    },
    {
      name: 'Club Sandwich',
      description: 'Triple-layer sandwich with turkey, bacon, and fresh vegetables',
      category: 'sandwiches',
      price: 8.95,
      imageUrl: 'https://images.unsplash.com/photo-1553979459-d2229ba7433a?w=400&h=300&fit=crop',
    },
    {
      name: 'Mediterranean Wrap',
      description: 'Fresh vegetables, feta cheese, and olive tapenade in a wrap',
      category: 'sandwiches',
      price: 7.60,
      imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
    },
  ];

  console.log('📦 Creating products...');
  
  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log('✅ Database seed completed!');
  console.log(`📊 Created ${products.length} products`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });