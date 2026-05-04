const express = require('express');
console.log('Carousel Routes Loaded');
const router = express.Router();

const {
  getCarousels,
  createCarousel,
  updateCarousel,
  deleteCarousel
} = require('../controllers/carouselController');

const { protect, authorize } = require('../middlewares/authMiddleware');

router.get('/', getCarousels);

router.use(protect);
router.use(authorize('Admin'));

router.post('/', createCarousel);
router.route('/:id')
  .put(updateCarousel)
  .delete(deleteCarousel);

module.exports = router;
