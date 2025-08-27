# ☕ Local Café - Modern Coffee Shop Web Application

A full-stack web application for a local coffee shop built with modern technologies. Features online ordering, user authentication, menu browsing, and more.

![Local Café](https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&h=400&fit=crop)

## ✨ Features

### 🏠 **Homepage**
- Hero section with stunning visuals
- Featured products showcase
- Modern café aesthetic design
- Responsive layout

### 🍽️ **Menu & Ordering**
- Browse products by category (Coffee, Pastries, Cakes, Sandwiches)
- Real-time cart management
- Product details with images and descriptions
- Euro pricing (€)

### 👤 **User Authentication**
- User registration and login
- JWT-based authentication
- User profile management
- Order history tracking
- Demo account available

### 📱 **User Profile**
- Personal information management
- Order history with detailed breakdowns
- Account statistics
- Secure logout functionality

### ℹ️ **About Page**
- Company story and values
- Team member profiles
- Bean-to-cup journey
- Awards and achievements

### 📍 **Contact Page**
- Interactive Berlin map (Kastanienallee 45)
- Contact form with validation
- Business hours and location details
- Transportation information
- FAQ section

### 🛒 **Shopping Cart**
- Add/remove items
- Quantity management
- Real-time total calculation
- Persistent cart state

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **React Hot Toast** - Notifications
- **React Context API** - State management

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Prisma ORM** - Database toolkit
- **SQLite** - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin requests

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/local-cafe.git
   cd local-cafe
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Set up Database**
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

4. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

5. **Start Development Servers**

   Backend:
   ```bash
   cd backend
   npm run dev
   ```

   Frontend:
   ```bash
   cd frontend
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:3004
   - Backend API: http://localhost:3002

## 👤 Demo Account

Use these credentials to test the application:

- **Email**: demo@localcafe.com
- **Password**: demo123

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
