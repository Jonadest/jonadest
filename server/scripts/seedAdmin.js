// scripts/seedAdmin.js
import bcrypt from 'bcryptjs';
import { connectDB } from '../lib/db.js';
import User from '../models/User.js';

async function seedAdmin() {
  await connectDB();

  const existingAdmin = await User.findOne({ email: 'admin' });

  if (existingAdmin) {
    console.log('⚠️ Admin user already exists');
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash('admin123', 10);

  await User.create({
    email: 'admin', // username as email
    password: hashedPassword,
  });

  console.log('✅ Admin user created successfully');
  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error('❌ Error seeding admin:', err.message);
  process.exit(1);
});
