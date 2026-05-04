const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  adminLogin, 
  getMe, 
  verifyOTP, 
  getBrokers, 
  updateBrokerStatus, 
  deleteBroker, 
  getBrokerById, 
  getStats, 
  updateMe,
  getNotifications,
  markNotificationRead
} = require('../controllers/authController');

const { protect, authorize } = require('../middlewares/authMiddleware');

router.post('/register', register);
router.post('/verify-otp', verifyOTP);
router.post('/login', login);
router.post('/admin/login', adminLogin);

router.get('/me', protect, getMe);
router.put('/updateme', protect, updateMe);
router.get('/stats', protect, authorize('Admin'), getStats);
router.get('/brokers', protect, authorize('Admin'), getBrokers);
router.get('/brokers/:id', protect, authorize('Admin'), getBrokerById);
router.patch('/brokers/:id/status', protect, authorize('Admin'), updateBrokerStatus);
router.delete('/brokers/:id', protect, authorize('Admin'), deleteBroker);

router.get('/notifications', protect, getNotifications);
router.patch('/notifications/:id/read', protect, markNotificationRead);

module.exports = router;
