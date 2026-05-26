const express = require('express');
const router = express.Router();

const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');

const { protect } = require('../middlewares/authMiddleware');

// Public or standard logged in user route to fetch
router.get('/', getCategories);

// Admin routes
router.use(protect);
router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;
