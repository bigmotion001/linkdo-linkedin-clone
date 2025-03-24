import express from 'express';
const app = express();
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
dotenv.config();
const PORT = process.env.PORT || 5000;

import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import { connectDB } from './lib/db.js';


app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);








app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});


