const express = require('express');
const router = express.Router();
const { register, login, getMe, verifyOTP, getBrokers, updateBrokerStatus, deleteBroker, getBrokerById, getStats, updateMe } = require('../controllers/authController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.post('/register', register);
router.post('/verify-otp', verifyOTP);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/updateme', protect, updateMe);
router.get('/stats', protect, authorize('Administrator', 'Super Admin'), getStats);
router.get('/brokers', protect, authorize('Administrator', 'Super Admin'), getBrokers);
router.get('/brokers/:id', protect, authorize('Administrator', 'Super Admin'), getBrokerById);
router.patch('/brokers/:id/status', protect, authorize('Administrator', 'Super Admin'), updateBrokerStatus);
router.delete('/brokers/:id', protect, authorize('Administrator', 'Super Admin'), deleteBroker);

module.exports = router;
