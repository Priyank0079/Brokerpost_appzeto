const User = require('../models/User');
const Admin = require('../models/Admin');

const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const Group = require('../models/Group');
const Notification = require('../models/Notification');
const mongoose = require('mongoose');

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
      password,
      phoneNumber, 
      city, 
      companyName, 
      address, 
      pinCode, 
      reraNumber, 
      profileImage,
      associatedGroup,
      agreeWithTerms 
    } = req.body;

    const userExists = await User.findOne({ 
      $or: [
        { email }, 
        { phoneNumber }
      ] 
    });

    if (userExists) {
      if (userExists.isEmailVerified) {
        const message = userExists.email === email 
          ? 'Email already registered' 
          : 'Phone number already registered';
        return res.status(400).json({ success: false, message });
      }
      // If user exists but not verified, we'll delete it to allow a fresh registration attempt
      await User.deleteOne({ _id: userExists._id });
    }

    const otp = '123456'; // Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      operatingCity: city,
      companyName,
      officeAddress: address,
      officeCity: city,
      pinCode,
      reraNumber,
      profileImage,
      associatedGroup,
      agreeWithTerms,
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

    // Auto-add to Group if associatedGroup was selected during registration
    if (user.associatedGroup) {
      try {
        const group = await Group.findOne({ name: user.associatedGroup });
        if (group && !group.members.includes(user._id)) {
          group.members.push(user._id);
          await group.save();
          console.log(`Auto-added user ${user._id} to group ${group.name}`);
        }
      } catch (err) {
        console.error('Auto-group addition failed:', err);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Email verified and password set successfully',
      token: generateToken(user._id, 'User')

    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send Login OTP
// @route   POST /api/v1/auth/login/send-otp
// @access  Public
exports.sendLoginOTP = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'No account found with this email' });
    }

    if (!user.isEmailVerified) {
      return res.status(401).json({ success: false, message: 'Account exists but email not verified' });
    }

    const otp = '123456'; // Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: 'OTP sent to email (Static: 123456)',
      email: user.email
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Login OTP
// @route   POST /api/v1/auth/login/verify-otp
// @access  Public
exports.verifyLoginOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ 
      email, 
      otp, 
      otpExpires: { $gt: Date.now() } 
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ success: false, message: 'Your account has been blocked by the administrator.' });
    }

    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save({ validateBeforeSave: false });

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
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user (Password)
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

    if (!user.isVerified) {
      return res.status(403).json({ success: false, message: 'Your account has been blocked by the administrator.' });
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
        reraNumber: user.reraNumber,
        profileImage: user.profileImage
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
    const { page = 1, limit = 8 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const total = await User.countDocuments({ role: 'Broker' });
    const brokers = await User.find({ role: 'Broker' })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const Posting = require('../models/Posting');
    const Group = require('../models/Group');

    const data = await Promise.all(
      brokers.map(async (broker) => {
        const listingCount = await Posting.countDocuments({
          postedBy: broker._id,
          isActive: true
        });
        const brokerGroups = await Group.find({ members: broker._id }, 'name');
        return {
          ...broker,
          listingCount,
          listingLimit: broker.listingLimit || 25,
          groups: brokerGroups.map(g => g.name)
        };
      })
    );

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      count: data.length,
      data: data
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

// @desc    Update broker details (Admin only)
// @route   PUT /api/v1/auth/brokers/:id
// @access  Private/Admin
exports.updateBroker = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phoneNumber: req.body.phoneNumber,
      companyName: req.body.companyName,
      operatingCity: req.body.operatingCity,
      officeAddress: req.body.officeAddress,
      listingLimit: req.body.listingLimit
    };

    if (req.body.password) {
      fieldsToUpdate.password = req.body.password;
    }

    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Broker not found' });
    }

    Object.assign(user, fieldsToUpdate);
    await user.save();

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
    
    const Posting = require('../models/Posting');
    const totalListings = await Posting.countDocuments({ isActive: true });

    res.status(200).json({
      success: true,
      data: {
        totalBrokers,
        pendingBrokers,
        verifiedBrokers,
        totalListings
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

    if (req.body.profileImage !== undefined) {
      fieldsToUpdate.profileImage = req.body.profileImage;
    }

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
    const notifications = await Notification.find({ recipient: req.user._id })
      .populate({
        path: 'relatedId',
        model: 'Posting',
        populate: {
          path: 'postedBy',
          select: 'firstName lastName name phoneNumber companyName operatingCity'
        }
      })
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

// @desc    Get unread notification count
// @route   GET /api/v1/auth/notifications/unread-count
// @access  Private
exports.getUnreadNotificationCount = async (req, res, next) => {
  try {
    const count = await Notification.countDocuments({ recipient: req.user._id, isRead: false });

    res.status(200).json({
      success: true,
      count
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

// @desc    Update password
// @route   PUT /api/v1/auth/updatepassword
// @access  Private
exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Support either User or Admin
    let user = await User.findById(req.user.id).select('+password');
    if (!user) {
      user = await Admin.findById(req.user.id).select('+password');
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Incorrect current password' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    next(error);
  }
};


