# ☕ Local Café Web App

A modern, full-stack coffee shop web application built with Next.js, Express.js, and Prisma. This application provides a complete digital experience for a local café, featuring user authentication, product management, shopping cart functionality, and order processing.

## 🌟 Features

### Frontend (Next.js)
- **Modern UI/UX**: Beautiful, responsive design with Tailwind CSS
- **User Authentication**: Secure login and registration system
- **Product Catalog**: Browse coffee, pastries, and merchandise
- **Shopping Cart**: Add, remove, and manage items
- **Order Management**: Place and track orders
- **User Dashboard**: View order history and account details
- **Mobile Responsive**: Optimized for all device sizes

### Backend (Express.js + Prisma)
- **RESTful API**: Clean, organized API endpoints
- **Database Management**: SQLite database with Prisma ORM
- **User Authentication**: JWT-based authentication system
- **Product Management**: CRUD operations for products
- **Order Processing**: Complete order lifecycle management
- **Data Validation**: Input validation and error handling

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (React 19)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **State Management**: React Context API
- **HTTP Client**: Fetch API

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **Language**: TypeScript

### Development Tools
- **Package Manager**: npm
- **Code Quality**: ESLint
- **Version Control**: Git
- **Deployment**: Vercel (Frontend)

## 📁 Project Structure

```
coffee-shop-web-app/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # App router pages
│   │   ├── components/      # Reusable UI components
│   │   └── contexts/        # React context providers
│   ├── public/              # Static assets
│   └── package.json
├── backend/                  # Express.js backend API
│   ├── src/
│   │   ├── routes/          # API route handlers
│   │   └── index.ts         # Server entry point
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   └── seed.ts          # Database seeding
│   └── package.json
├── .gitignore
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/coffee-shop-web-app.git
   cd coffee-shop-web-app
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install frontend dependencies
   cd frontend
   npm install
   
   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # In the backend directory
   cp .env.example .env
   ```
   
   Edit the `.env` file with your configuration:
   ```env
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="your-super-secret-jwt-key"
   PORT=3001
   ```

4. **Set up the database**
   ```bash
   # In the backend directory
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

5. **Start the development servers**
   
   **Backend (Terminal 1):**
   ```bash
   cd backend
   npm run dev
   ```
   
   **Frontend (Terminal 2):**
   ```bash
   cd frontend
   npm run dev
   ```

6. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## 📊 Database Schema

The application uses the following main entities:

- **User**: Customer accounts with authentication
- **Product**: Coffee, pastries, and merchandise items
- **Category**: Product categorization
- **Order**: Customer orders
- **OrderItem**: Individual items within orders

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/category/:category` - Get products by category

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order by ID

## 🎨 UI Components

- **Header**: Navigation with cart and user menu
- **ProductCard**: Display product information
- **Cart**: Shopping cart with item management
- **OrderSummary**: Order details and checkout
- **UserDashboard**: Account management interface

## 🚀 Deployment

### Frontend (Vercel)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set the root directory to `frontend`
4. Deploy automatically

### Backend (Railway/Heroku)
1. Set up your preferred hosting service
2. Configure environment variables
3. Deploy the backend directory
4. Update frontend API URLs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Prisma team for the excellent ORM
- Tailwind CSS for the utility-first CSS framework
- Vercel for seamless deployment

---

**Happy Coding! ☕**