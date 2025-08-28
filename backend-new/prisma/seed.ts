import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Hot Beverages',
        description: 'Freshly brewed hot drinks to warm your soul',
        imageUrl: '/images/categories/hot-beverages.jpg',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Cold Beverages',
        description: 'Refreshing cold drinks for any time of day',
        imageUrl: '/images/categories/cold-beverages.jpg',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Pastries',
        description: 'Freshly baked pastries and sweet treats',
        imageUrl: '/images/categories/pastries.jpg',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Sandwiches',
        description: 'Delicious sandwiches made with fresh ingredients',
        imageUrl: '/images/categories/sandwiches.jpg',
      },
    }),
  ]);

  console.log('✅ Categories created');

  // Create products
  const products = await Promise.all([
    // Hot Beverages
    prisma.product.create({
      data: {
        name: 'Espresso',
        description: 'Rich and bold single shot of espresso',
        price: 2.50,
        imageUrl: '/images/products/espresso.jpg',
        categoryId: categories[0].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Cappuccino',
        description: 'Perfect balance of espresso, steamed milk, and foam',
        price: 4.25,
        imageUrl: '/images/products/cappuccino.jpg',
        categoryId: categories[0].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Latte',
        description: 'Smooth espresso with steamed milk and light foam',
        price: 4.75,
        imageUrl: '/images/products/latte.jpg',
        categoryId: categories[0].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Americano',
        description: 'Espresso shots with hot water for a clean taste',
        price: 3.25,
        imageUrl: '/images/products/americano.jpg',
        categoryId: categories[0].id,
      },
    }),
    // Cold Beverages
    prisma.product.create({
      data: {
        name: 'Iced Coffee',
        description: 'Cold brew coffee served over ice',
        price: 3.75,
        imageUrl: '/images/products/iced-coffee.jpg',
        categoryId: categories[1].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Frappuccino',
        description: 'Blended coffee drink with ice and whipped cream',
        price: 5.25,
        imageUrl: '/images/products/frappuccino.jpg',
        categoryId: categories[1].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Iced Latte',
        description: 'Espresso with cold milk served over ice',
        price: 4.50,
        imageUrl: '/images/products/iced-latte.jpg',
        categoryId: categories[1].id,
      },
    }),
    // Pastries
    prisma.product.create({
      data: {
        name: 'Croissant',
        description: 'Buttery, flaky French pastry',
        price: 3.50,
        imageUrl: '/images/products/croissant.jpg',
        categoryId: categories[2].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Blueberry Muffin',
        description: 'Fresh baked muffin with juicy blueberries',
        price: 2.75,
        imageUrl: '/images/products/blueberry-muffin.jpg',
        categoryId: categories[2].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Chocolate Chip Cookie',
        description: 'Warm, gooey chocolate chip cookie',
        price: 2.25,
        imageUrl: '/images/products/chocolate-chip-cookie.jpg',
        categoryId: categories[2].id,
      },
    }),
    // Sandwiches
    prisma.product.create({
      data: {
        name: 'Turkey Club',
        description: 'Turkey, bacon, lettuce, tomato on toasted bread',
        price: 8.50,
        imageUrl: '/images/products/turkey-club.jpg',
        categoryId: categories[3].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Grilled Cheese',
        description: 'Classic grilled cheese with melted cheddar',
        price: 6.25,
        imageUrl: '/images/products/grilled-cheese.jpg',
        categoryId: categories[3].id,
      },
    }),
  ]);

  console.log('✅ Products created');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@localcafe.com',
      firstName: 'Admin',
      lastName: 'User',
      phone: '+1234567890',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('✅ Admin user created');

  // Create sample customer
  const customerPassword = await bcrypt.hash('customer123', 10);
  const customer = await prisma.user.create({
    data: {
      email: 'customer@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1987654321',
      password: customerPassword,
      role: 'CUSTOMER',
    },
  });

  console.log('✅ Sample customer created');

  // Create sample order
  const sampleOrder = await prisma.order.create({
    data: {
      userId: customer.id,
      status: 'COMPLETED',
      totalPrice: 12.00,
      notes: 'Extra hot, please!',
      orderItems: {
        create: [
          {
            productId: products[1].id, // Cappuccino
            quantity: 2,
            price: 4.25,
          },
          {
            productId: products[7].id, // Croissant
            quantity: 1,
            price: 3.50,
          },
        ],
      },
    },
  });

  console.log('✅ Sample order created');

  console.log('🎉 Database seeded successfully!');
  console.log(`📊 Created:`);
  console.log(`   - ${categories.length} categories`);
  console.log(`   - ${products.length} products`);
  console.log(`   - 2 users (1 admin, 1 customer)`);
  console.log(`   - 1 sample order`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });