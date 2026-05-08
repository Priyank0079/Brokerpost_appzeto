const express = require('express');
const router = express.Router();

const {
  createPosting,
  getPostings,
  getMyPostings,
  getPostingById,
  updatePosting,
  deletePosting,
  getPostingStats
} = require('../controllers/postingController');

const { protect, optionalProtect } = require('../middlewares/authMiddleware');

// Public Feed — all active postings (filterable by query params)
// optionalProtect allows identifying user if logged in, but doesn't force login
router.get('/', optionalProtect, getPostings);

// Single posting detail
router.get('/:id', optionalProtect, getPostingById);

// All other routes require mandatory authentication
router.use(protect);

// My postings — current broker's own posts
router.get('/my', getMyPostings);

// Dashboard Stats
router.get('/stats', getPostingStats);

// Create new posting
router.post('/', createPosting);

// Update posting (owner only — enforced in controller)
router.patch('/:id', updatePosting);

// Soft-delete posting (owner or admin — enforced in controller)
router.delete('/:id', deletePosting);

module.exports = router;
