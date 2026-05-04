const Carousel = require('../models/Carousel');

// @desc    Get all carousel banners
// @route   GET /api/v1/carousel
// @access  Public
exports.getCarousels = async (req, res, next) => {
  try {
    const banners = await Carousel.find({ isActive: true }).sort({ order: 1 });
    res.status(200).json({
      success: true,
      data: banners
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new banner
// @route   POST /api/v1/carousel
// @access  Private/Admin
exports.createCarousel = async (req, res, next) => {
  try {
    const banner = await Carousel.create(req.body);
    res.status(201).json({
      success: true,
      data: banner
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update banner
// @route   PUT /api/v1/carousel/:id
// @access  Private/Admin
exports.updateCarousel = async (req, res, next) => {
  try {
    const banner = await Carousel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!banner) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }

    res.status(200).json({
      success: true,
      data: banner
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete banner
// @route   DELETE /api/v1/carousel/:id
// @access  Private/Admin
exports.deleteCarousel = async (req, res, next) => {
  try {
    const banner = await Carousel.findByIdAndDelete(req.params.id);

    if (!banner) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Banner deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
