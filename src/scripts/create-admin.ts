import mongoose from 'mongoose';
import {User} from '../models/User.model';
import bcrypt from 'bcryptjs';
require("dotenv").config();

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI!);

  const hashedPassword = await bcrypt.hash('secureAdminPass', 10);
  const admin = new User({
    name: 'Admin',
    email: 'admin@example.com',
    password: hashedPassword,
    role: 'admin',
  });

  await admin.save();
  console.log('✅ Admin created');
  process.exit();
}

createAdmin();
