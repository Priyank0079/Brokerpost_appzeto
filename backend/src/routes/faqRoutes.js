const express = require('express');
const router = express.Router();

const {
  getFAQs,
  getAdminFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ
} = require('../controllers/faqController');

const { protect, authorize } = require('../middlewares/authMiddleware');

// Public route to get active FAQs
router.get('/', getFAQs);

// Protected Admin routes
router.use(protect);
router.use(authorize('Admin'));

router.get('/admin', getAdminFAQs);
router.post('/', createFAQ);
router.route('/:id')
  .put(updateFAQ)
  .delete(deleteFAQ);

module.exports = router;
