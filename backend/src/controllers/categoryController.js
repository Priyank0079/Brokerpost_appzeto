const Category = require('../models/Category');

// @desc    Get all active categories
// @route   GET /api/v1/categories
// @access  Public/Broker
exports.getCategories = async (req, res, next) => {
  try {
    const { vertical, intent } = req.query;
    const filter = { isActive: true };
    if (vertical) filter.vertical = vertical;
    if (intent) filter.intent = intent;

    const categories = await Category.find(filter).sort({ vertical: 1, name: 1 });
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new category
// @route   POST /api/v1/categories
// @access  Admin
exports.createCategory = async (req, res, next) => {
  try {
    if (req.userModel !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    const category = await Category.create(req.body);
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a category
// @route   PUT /api/v1/categories/:id
// @access  Admin
exports.updateCategory = async (req, res, next) => {
  try {
    if (req.userModel !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete (soft-delete) a category
// @route   DELETE /api/v1/categories/:id
// @access  Admin
exports.deleteCategory = async (req, res, next) => {
  try {
    if (req.userModel !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    const category = await Category.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
