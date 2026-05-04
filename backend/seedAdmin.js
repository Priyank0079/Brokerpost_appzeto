require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./src/models/Admin');
const connectDB = require('./src/config/db');

const seedAdmin = async () => {
  try {
    await connectDB();

    const email = 'admin@brokerpost.com';
    const adminExists = await Admin.findOne({ email });

    if (adminExists) {
      console.log('Admin already exists');
      process.exit();
    }

    await Admin.create({
      name: 'System Admin',
      email: email,
      password: 'Admin@123',
      role: 'Admin'
    });

    console.log('Admin seeded successfully');
    process.exit();
  } catch (error) {
    console.error('Error seeding admin:', error.message);
    process.exit(1);
  }
};

seedAdmin();
