import dotenv from 'dotenv';
dotenv.config();

import { connectDB } from './src/db/db.js';
import { Admin } from './src/models/user.models.js';

try {
  await connectDB();
  console.log("MongoDB connected");

  const admin = await Admin.find({})
//   const admin = new Admin ({
//     username: 'admin1',
//     email: '',
//     password: 'admin1235',
//     name: 'Admin User',
//     phone_number: '1234567890',
//     age: 25,
//     isVerified: true,
//     user_management: ['ban_user', 'unban_user', 'delete_user'],
//     product_management: ['edit_product', 'delete_product'],
//     review_management: ['delete_review']
//   })
  console.log(admin)
  console.log("Admin user created successfully");

  process.exit(0);
} catch (err) {
  console.error("Error seeding admin:", err);
  process.exit(1);
}
