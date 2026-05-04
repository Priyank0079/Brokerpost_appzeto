const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please provide a first name'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Please provide a last name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [false, 'Please provide a password'], // Optional if it's an application
    minlength: 6,
    select: false
  },
  phoneNumber: {
    type: String,
    required: [true, 'Please provide a phone number'],
    trim: true
  },
  operatingCity: {
    type: String,
    required: [true, 'Please provide an operating city'],
    trim: true
  },
  companyName: {
    type: String,
    required: [true, 'Please provide a company name'],
    trim: true
  },
  officeAddress: {
    type: String,
    required: [true, 'Please provide an office address'],
    trim: true
  },
  officeCity: {
    type: String,
    required: [true, 'Please provide an office city'],
    trim: true
  },
  pinCode: {
    type: String,
    required: [true, 'Please provide a pin code'],
    trim: true
  },
  reraNumber: {
    type: String,
    trim: true
  },
  associatedGroup: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    enum: ['Broker'],
    default: 'Broker'
  },

  profileImage: String,
  isVerified: {
    type: Boolean,
    default: false
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  otp: {
    type: String
  },
  otpExpires: {
    type: Date
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
