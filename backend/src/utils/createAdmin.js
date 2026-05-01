const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');

// Load env vars from root
dotenv.config({ path: path.join(__dirname, '../../.env') });

const createAdmin = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('Error: MONGODB_URI not found in .env');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected...');

    const adminData = {
      firstName: 'Super',
      lastName: 'Admin',
      email: 'admin@brokerpost.com',
      password: 'Admin@123',
      phoneNumber: '0000000000',
      operatingCity: 'Delhi',
      companyName: 'BrokerPost Admin',
      officeAddress: 'Admin HQ',
      officeCity: 'Delhi',
      pinCode: '110001',
      role: 'Super Admin',
      isEmailVerified: true,
      isVerified: true
    };

    const existingAdmin = await User.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log('Admin already exists with email:', adminData.email);
      process.exit();
    }

    await User.create(adminData);
    console.log('Admin user created successfully!');
    console.log('---------------------------');
    console.log('Login ID:', adminData.email);
    console.log('Password:', adminData.password);
    console.log('---------------------------');
    process.exit();
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();
