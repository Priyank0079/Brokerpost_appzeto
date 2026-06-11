const express = require('express');
const router = express.Router();
const { saveFcmToken, removeFcmToken } = require('../controllers/fcmController');
const { protect } = require('../middlewares/authMiddleware');

// All FCM routes require authentication
router.post('/token', protect, saveFcmToken);
router.delete('/token', protect, removeFcmToken);

module.exports = router;
