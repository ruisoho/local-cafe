# Local Café - Coffee Shop Website

A modern, full-stack coffee shop website built with Next.js, TypeScript, Tailwind CSS, and Prisma. Features a beautiful responsive design with complete e-commerce functionality.

![Local Café](https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&h=400&fit=crop)

## 🌟 Features

### Frontend
- **Modern Design**: Beautiful, responsive UI with Tailwind CSS
- **Homepage**: Welcoming landing page with hero section and feature highlights
- **Menu Page**: Interactive product catalog with search and filtering
- **Shopping Cart**: Full cart functionality with quantity management
- **Authentication**: Login and registration pages with form validation
- **Mobile Responsive**: Optimized for all device sizes

### Backend
- **TypeScript API**: Type-safe serverless functions
- **Prisma ORM**: Database management with PostgreSQL
- **JWT Authentication**: Secure user authentication
- **RESTful API**: Complete CRUD operations for products, orders, and users
- **Vercel Deployment**: Optimized for serverless deployment

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Axios** - HTTP client for API requests

### Backend
- **Node.js** - JavaScript runtime
- **TypeScript** - Type-safe backend development
- **Prisma** - Modern database toolkit
- **PostgreSQL** - Robust relational database
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Express.js** - Web framework for API routes

## 📁 Project Structure

```
Coffee Shop/
├── backend-new/
│   ├── api/
│   │   └── index.ts          # Main API endpoint
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema
│   │   └── seed.ts           # Database seeding
│   ├── package.json
│   ├── tsconfig.json
│   ├── vercel.json           # Vercel deployment config
│   └── .env.example          # Environment variables template
├── frontend-new/
│   ├── src/
│   │   └── app/
│   │       ├── page.tsx      # Homepage
│   │       ├── menu/         # Menu page
│   │       ├── cart/         # Shopping cart
│   │       └── auth/         # Authentication pages
│   ├── package.json
│   ├── tailwind.config.js
│   └── next.config.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- Vercel account (for deployment)

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd "Coffee Shop/backend-new"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your database URL and JWT secret:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/localcafe"
   JWT_SECRET="your-super-secret-jwt-key"
   NODE_ENV="development"
   FRONTEND_URL="http://localhost:3000"
   ```

4. **Set up database**:
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   npx prisma db seed
   ```

5. **Start development server**:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd "../frontend-new"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Visit `http://localhost:3000` to see the application

## 🗄️ Database Schema

The application uses the following main entities:

- **User**: Customer accounts with authentication
- **Category**: Product categories (Coffee, Tea, Pastries, etc.)
- **Product**: Menu items with pricing and descriptions
- **Order**: Customer orders with status tracking
- **OrderItem**: Individual items within orders

## 🔐 Authentication

The application includes:
- User registration with validation
- Secure login with JWT tokens
- Password hashing with bcryptjs
- Protected API routes
- Demo credentials for testing:
  - Email: `demo@localcafe.com`
  - Password: `password`

## 🎨 Design Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern UI**: Clean, professional design with warm coffee shop aesthetics
- **Interactive Elements**: Hover effects, loading states, and smooth transitions
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Performance**: Optimized images and lazy loading

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Backend Deployment**:
   - Push your code to GitHub
   - Connect your repository to Vercel
   - Set environment variables in Vercel dashboard
   - Deploy the backend-new directory

2. **Frontend Deployment**:
   - Deploy the frontend-new directory to Vercel
   - Update API endpoints to point to your deployed backend

3. **Database Setup**:
   - Use Vercel Postgres or any PostgreSQL provider
   - Run migrations in production
   - Seed the database with initial data

### Environment Variables for Production

**Backend**:
```env
DATABASE_URL="your-production-database-url"
JWT_SECRET="your-production-jwt-secret"
NODE_ENV="production"
FRONTEND_URL="https://your-frontend-domain.vercel.app"
```

## 📱 Pages Overview

### Homepage (`/`)
- Hero section with call-to-action
- Feature highlights
- Popular items preview
- Contact information

### Menu (`/menu`)
- Product catalog with categories
- Search and filter functionality
- Add to cart functionality
- Responsive product grid

### Cart (`/cart`)
- Shopping cart management
- Quantity adjustments
- Order summary with tax calculation
- Checkout process

### Authentication (`/auth/login`, `/auth/register`)
- User login and registration
- Form validation
- Password visibility toggle
- Responsive forms

## 🔧 Development

### Available Scripts

**Backend**:
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:migrate` - Run database migrations
- `npm run db:generate` - Generate Prisma client
- `npm run db:seed` - Seed database with sample data

**Frontend**:
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style
- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Consistent naming conventions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Design inspiration from modern coffee shop websites
- Icons provided by Lucide React
- UI components styled with Tailwind CSS
- Database management with Prisma ORM

---

**Built with ❤️ for coffee lovers everywhere**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

Made with ☕ and ❤️
