import dotenv from 'dotenv';
dotenv.config();

import { connectDB } from './backend/src/db/db.js';
import { Admin } from './backend/src/models/user.models.js';

try {
  await connectDB();
  console.log("MongoDB connected");

  const admin = new Admin ({
    username: '',
    email: '',
    password: '',
    name: '',
    phone_number: '',
    age: 25,
    isVerified: true,
    user_management: ['ban_user', 'unban_user', 'delete_user'],
    product_management: ['edit_product', 'delete_product'],
    review_management: ['delete_review']
  })

  await admin.save()
  console.log(admin)
  console.log("Admin user created successfully");

  process.exit(0);
} catch (err) {
  console.error("Error seeding admin:", err);
  process.exit(1);
}
