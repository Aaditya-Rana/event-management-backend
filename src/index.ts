require('dotenv').config();
import "./config/cloudinary.config";
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from './config/app.config';
import connectDatabase from './config/db.config';
import authRoutes from "./routes/auth.routes";
import categoryRoutes from "./routes/category.routes";
import eventRoutes from "./routes/event.routes";
import bookingRoutes from "./routes/booking.routes";

const BASE_PATH=config.BASE_PATH;

const app = express();

const allowedOrigins=config.FRONTEND_ORIGIN.split(",") || [];

app.use(cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());


app.get('/', (_req, res) => {
  res.send('✅ EventEase API running');
});

app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/categories`, categoryRoutes);
app.use(`${BASE_PATH}/events`, eventRoutes);
app.use(`${BASE_PATH}/bookings`, bookingRoutes);

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = config.PORT || 5000;

app.listen(PORT, async () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    await connectDatabase();
});