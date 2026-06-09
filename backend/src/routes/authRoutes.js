const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  sendLoginOTP,
  verifyLoginOTP,
  adminLogin, 
  getMe, 
  verifyOTP, 
  forgotPassword,
  resetPassword,
  getBrokers, 
  updateBrokerStatus, 
  deleteBroker, 
  getBrokerById, 
  getStats, 
  updateMe,
  updatePassword,
  getNotifications,
  getUnreadNotificationCount,
  markNotificationRead,
  updateBroker
} = require('../controllers/authController');

const { protect, authorize } = require('../middlewares/authMiddleware');

router.post('/register', register);
router.post('/verify-otp', verifyOTP);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/login', login);
router.post('/login/send-otp', sendLoginOTP);
router.post('/login/verify-otp', verifyLoginOTP);
router.post('/admin/login', adminLogin);

router.get('/me', protect, getMe);
router.put('/updateme', protect, updateMe);
router.put('/updatepassword', protect, updatePassword);
router.get('/stats', protect, authorize('Admin'), getStats);
router.get('/brokers', protect, authorize('Admin'), getBrokers);
router.get('/brokers/:id', protect, authorize('Admin'), getBrokerById);
router.patch('/brokers/:id/status', protect, authorize('Admin'), updateBrokerStatus);
router.put('/brokers/:id', protect, authorize('Admin'), updateBroker);
router.delete('/brokers/:id', protect, authorize('Admin'), deleteBroker);

router.get('/notifications', protect, getNotifications);
router.get('/notifications/unread-count', protect, getUnreadNotificationCount);
router.patch('/notifications/:id/read', protect, markNotificationRead);

module.exports = router;
