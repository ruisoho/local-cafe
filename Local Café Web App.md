# Project 04: Local Café Web App  
**Reference design:** [Republic of Pie](https://republicofpie.com/)  
**Color Scheme & Fonts:** Same as reference (earthy tones, elegant serif/sans-serif pairing)  

## 🎯 Goals
- Build a modern, slick café website with ordering functionality.  
- Include menu browsing, to-go/pickup ordering, and online payment.  
- Use **copyright-free images** for coffee, cakes, food, and branding (e.g., Unsplash, Pexels).  
- Host on **VPS**, running in a **Docker container**.  
- Database: **SQLite** for simplicity and portability.  

---

## 🛠️ Tech Stack
- **Frontend:** React (Next.js optional), TailwindCSS  
- **Backend:** Node.js (Express.js)  
- **Database:** SQLite (via Prisma ORM for clean queries)  
- **Auth:** JWT-based login (customers)  
- **Payments:** Stripe (test mode in dev)  
- **Hosting:** VPS (Docker container)  
- **Images:** Unsplash/Pexels free stock photos  

---

## 📊 Features
- 🏠 **Homepage:** modern, image-heavy, slick hero with café vibe.  
- 📖 **Menu Page:** categorized items (coffee, pastries, cakes, sandwiches).  
- 🛒 **Shop:** user login, add items to cart, checkout.  
- 💳 **Payment Integration:** online card payments via Stripe.  
- 📦 **Order Management:** pickup orders stored in SQLite, dashboard for café staff.  
- 👤 **User Account:** profile, order history.  
- 📱 **Responsive:** optimized for desktop + mobile.  

---

## 📂 GitHub Project Board Structure
- **To Do**
  - UI wireframes (Figma / Whimsical)  
  - Set up React frontend  
  - Set up Express backend  
  - Configure SQLite + Prisma  
  - Stripe test integration  
  - Image sourcing  

- **In Progress**
  - User authentication  
  - Cart + checkout flow  
  - Staff dashboard  

- **Done**
  - Static landing page  
  - Menu with categories  

---

## 🧩 Milestones / Tasks
1. **Setup**
   - Create repo + init project (frontend + backend in monorepo with Turborepo or Nx).  
   - Dockerfile for containerization.  
   - Initialize SQLite with Prisma schema.  

2. **Frontend**
   - Build homepage with café vibe.  
   - Create menu browsing UI.  
   - Cart & checkout UI.  
   - Login/signup forms.  

3. **Backend**
   - Express routes for products, users, orders.  
   - Prisma integration with SQLite.  
   - JWT authentication.  
   - Stripe checkout session API.  

4. **Testing**
   - End-to-end tests with Playwright or Cypress.  
   - API unit tests with Jest.  

5. **Deployment**
   - Package with Docker.  
   - Deploy container to VPS.  
   - Add reverse proxy (NGINX).  

---

## 🗂️ Database Schema (SQLite via Prisma)
```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  orders    Order[]
}

model Product {
  id        Int      @id @default(autoincrement())
  name      String
  category  String
  price     Float
  imageUrl  String?
  orders    OrderItem[]
}

model Order {
  id        Int      @id @default(autoincrement())
  userId    Int
  status    String   @default("pending")
  createdAt DateTime @default(now())
  items     OrderItem[]
  user      User     @relation(fields: [userId], references: [id])
}

model OrderItem {
  id        Int     @id @default(autoincrement())
  orderId   Int
  productId Int
  quantity  Int
  order     Order   @relation(fields: [orderId], references: [id])
  product   Product @relation(fields: [productId], references: [id])
}
