const express = require('express');
const router = express.Router();

const {
  createPosting,
  getPostings,
  getMyPostings,
  getPostingById,
  updatePosting,
  deletePosting
} = require('../controllers/postingController');

const { protect } = require('../middlewares/authMiddleware');

// All posting routes require authentication
router.use(protect);

// Feed — all active postings (filterable by query params)
router.get('/', getPostings);

// My postings — current broker's own posts
router.get('/my', getMyPostings);

// Single posting detail
router.get('/:id', getPostingById);

// Create new posting
router.post('/', createPosting);

// Update posting (owner only — enforced in controller)
router.patch('/:id', updatePosting);

// Soft-delete posting (owner or admin — enforced in controller)
router.delete('/:id', deletePosting);

module.exports = router;
