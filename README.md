# 🎯 Event Management Backend

This is the backend server for the **Event Management Platform**, built using modern web technologies including **Node.js**, **Express.js**, **TypeScript**, and **MongoDB**. It provides robust APIs for managing events, bookings, authentication, and admin operations.

---

## 🚀 Tech Stack

- **Node.js** & **Express.js** – Backend runtime and routing
- **MongoDB** + **Mongoose** – NoSQL database and schema modeling
- **TypeScript** – Type safety for better development experience
- **Cloudinary** – Image upload and cloud storage
- **JWT (JSON Web Tokens)** – User authentication and authorization
- **Day.js** – Lightweight date utility for time-based logic

---

## 📦 Features

### 👤 Authentication & Authorization

- User registration and login with hashed passwords
- JWT-based authentication (access & refresh tokens)
- Role-based access control: `ADMIN` and `USER`

### 📅 Event Management

- Create, update, delete events (Admin-only)
- Cloudinary integration for thumbnail uploads
- Events categorized and searchable
- Events have virtual `status`: `UPCOMING`, `ONGOING`, `COMPLETED`
- Pagination, filtering, and sorting supported

### 🪑 Booking System

- Registered users can book available seats
- Validations:
  - Cannot book completed events
  - Cannot overbook beyond event capacity
  - Cannot book the same event twice
- Users can cancel only *upcoming* event bookings

### 🛠 Admin Operations

- View all bookings with pagination
- Filter bookings by event
- View bookings per event
- Secure access to admin routes

---

### setup
-npm install
-npm run dev
-to create admin with name and password (run script "npm run script")
-include .env file

###.env file
NODE_ENV=
PORT=
REFRESH_SECRET=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
FRONTEND_ORIGIN=
MONGO_URI=

## 🗂 Folder Structure

```bash
├── config/                # Database & cloudinary config
├── constants/             # Reusable enums and error codes
├── controllers/           # Route handlers
├── middlewares/           # Auth and error middleware
├── models/                # Mongoose schemas
├── routes/                # Express route definitions
├── services/              # Core business logic
├── types/                 # Custom TypeScript types
├── utils/                 # Helpers (e.g. generateId, password hashing)
├── scripts/               # CLI scripts (admin creation, etc.)
├── index.ts               # App entry point
└── README.md
