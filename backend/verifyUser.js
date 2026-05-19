const mongoose = require('mongoose');
const User = require('./src/models/User');
const dotenv = require('dotenv');

dotenv.config();

const verifyUser = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.error('Error: MONGODB_URI is not defined in backend/.env');
      return;
    }
    
    console.log('Connecting to database...');
    await mongoose.connect(uri);
    console.log('Connected successfully!');

    const email = 'mirnal@gmail.com';
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      console.log(`\n❌ User with email "${email}" does not exist in this database.`);
      console.log('You can register this email fresh in the browser.');
    } else {
      user.isEmailVerified = true;
      user.password = '123456'; // Will be auto-hashed by pre-save hook
      await user.save();
      console.log(`\n✅ Success! User "${email}" has been verified and password set to "123456".`);
      console.log('You can now log in successfully!');
    }
  } catch (error) {
    console.error('Error occurred:', error);
  } finally {
    await mongoose.disconnect();
  }
};

verifyUser();
