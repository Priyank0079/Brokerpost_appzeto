const express = require('express');
const router = express.Router();
const { 
  getLandingConfig, 
  updateLandingConfig 
} = require('../controllers/landingConfigController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.get('/', getLandingConfig);
router.put('/', protect, authorize('Admin'), updateLandingConfig);

module.exports = router;
