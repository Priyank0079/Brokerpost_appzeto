const User = require('../models/User');
const Admin = require('../models/Admin');

const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

// Generate JWT Token
const generateToken = (id, model = 'User') => {
  return jwt.sign({ id, model }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};


// @desc    Register user and send OTP
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { 
      firstName, 
      lastName, 
      email, 
      phoneNumber, 
      city, 
      companyName, 
      officeAddress, 
      officeCity, 
      pinCode, 
      reraNumber, 
      associatedGroup 
    } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      if (userExists.isEmailVerified) {
        return res.status(400).json({ success: false, message: 'User already exists' });
      }
      // If user exists but not verified, we'll update it later or just re-send OTP
      await User.deleteOne({ email });
    }

    const otp = '123456'; // Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const user = await User.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      operatingCity: city,
      companyName,
      officeAddress,
      officeCity,
      pinCode,
      reraNumber,
      associatedGroup,
      otp,
      otpExpires,
      isEmailVerified: false
    });

    /*
    try {
      await sendEmail({
        email: user.email,
        subject: 'BrokerPost Email Verification OTP',
        message: `Your verification OTP is: ${otp}. It will expire in 10 minutes.`,
        html: `<h1>Email Verification</h1><p>Your verification OTP is: <strong>${otp}</strong>. It will expire in 10 minutes.</p>`
      });

      res.status(201).json({
        success: true,
        message: 'OTP sent to email',
        email: user.email
      });
    } catch (err) {
      user.otp = undefined;
      user.otpExpires = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(500).json({ success: false, message: 'Email could not be sent' });
    }
    */

    // For development: Return success without sending email
    res.status(201).json({
      success: true,
      message: 'OTP generated (Static: 123456)',
      email: user.email
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify OTP and Set Password
// @route   POST /api/v1/auth/verify-otp
// @access  Public
exports.verifyOTP = async (req, res, next) => {
  try {
    const { email, otp, password } = req.body;

    const user = await User.findOne({ 
      email, 
      otp, 
      otpExpires: { $gt: Date.now() } 
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    // Set password and verify email
    user.password = password;
    user.isEmailVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Email verified and password set successfully',
      token: generateToken(user._id, 'User')

    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user || !user.isEmailVerified) {
      return res.status(401).json({ success: false, message: 'Invalid credentials or email not verified' });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    res.json({
      success: true,
      token: generateToken(user._id, 'User'),

      data: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        companyName: user.companyName,
        operatingCity: user.operatingCity,
        phoneNumber: user.phoneNumber,
        officeAddress: user.officeAddress,
        officeCity: user.officeCity,
        pinCode: user.pinCode,
        reraNumber: user.reraNumber
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin Login
// @route   POST /api/v1/auth/admin/login
// @access  Public
exports.adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email }).select('+password');

    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }

    const isMatch = await admin.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }

    res.json({
      success: true,
      token: generateToken(admin._id, 'Admin'),

      data: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    next(error);
  }
};


// @desc    Get current user profile
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    let user = await User.findById(req.user.id);
    
    if (!user) {
      user = await Admin.findById(req.user.id);
    }

    if (user) {
      res.json({
        success: true,
        data: user
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all brokers (Admin only)
// @route   GET /api/v1/auth/brokers
// @access  Private/Admin
exports.getBrokers = async (req, res, next) => {
  try {
    const brokers = await User.find({ role: 'Broker' });

    res.status(200).json({
      success: true,
      count: brokers.length,
      data: brokers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update broker status (Admin only)
// @route   PATCH /api/v1/auth/brokers/:id/status
// @access  Private/Admin
exports.updateBrokerStatus = async (req, res, next) => {
  try {
    const { isVerified } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'Broker not found' });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete broker (Admin only)
// @route   DELETE /api/v1/auth/brokers/:id
// @access  Private/Admin
exports.deleteBroker = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Broker not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Broker deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
// @desc    Get single broker (Admin only)
// @route   GET /api/v1/auth/brokers/:id
// @access  Private/Admin
exports.getBrokerById = async (req, res, next) => {
  try {
    const broker = await User.findById(req.params.id);

    if (!broker) {
      return res.status(404).json({ success: false, message: 'Broker not found' });
    }

    res.status(200).json({
      success: true,
      data: broker
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get admin stats
// @route   GET /api/v1/auth/stats
// @access  Private/Admin
exports.getStats = async (req, res, next) => {
  try {
    const totalBrokers = await User.countDocuments({ role: 'Broker' });
    const pendingBrokers = await User.countDocuments({ role: 'Broker', isVerified: false });
    const verifiedBrokers = await User.countDocuments({ role: 'Broker', isVerified: true });

    res.status(200).json({
      success: true,
      data: {
        totalBrokers,
        pendingBrokers,
        verifiedBrokers,
        activeListings: 4821, // Placeholder until listings module is ready
        totalUsers: 18500 // Placeholder
      }
    });
  } catch (error) {
    next(error);
  }
};
// @desc    Update user profile
// @route   PUT /api/v1/auth/updateme
// @access  Private
exports.updateMe = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phoneNumber: req.body.phoneNumber,
      companyName: req.body.companyName,
      operatingCity: req.body.operatingCity,
      officeAddress: req.body.officeAddress,
      officeCity: req.body.officeCity,
      pinCode: req.body.pinCode,
      reraNumber: req.body.reraNumber
    };

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user notifications
// @route   GET /api/v1/auth/notifications
// @access  Private
exports.getNotifications = async (req, res, next) => {
  try {
    const Notification = require('../models/Notification');
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({
      success: true,
      data: notifications
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark notification as read
// @route   PATCH /api/v1/auth/notifications/:id/read
// @access  Private
exports.markNotificationRead = async (req, res, next) => {
  try {
    const Notification = require('../models/Notification');
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    res.status(200).json({
      success: true,
      data: notification
    });
  } catch (error) {
    next(error);
  }
};


