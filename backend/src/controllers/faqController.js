const FAQ = require('../models/FAQ');

// @desc    Get all FAQs
// @route   GET /api/v1/faqs
// @access  Public
exports.getFAQs = async (req, res, next) => {
  try {
    const faqs = await FAQ.find({ isActive: true }).sort({ order: 1 });
    res.status(200).json({
      success: true,
      data: faqs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all FAQs for Admin (including inactive ones)
// @route   GET /api/v1/faqs/admin
// @access  Private/Admin
exports.getAdminFAQs = async (req, res, next) => {
  try {
    const faqs = await FAQ.find().sort({ order: 1 });
    res.status(200).json({
      success: true,
      data: faqs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new FAQ
// @route   POST /api/v1/faqs
// @access  Private/Admin
exports.createFAQ = async (req, res, next) => {
  try {
    const faq = await FAQ.create(req.body);
    res.status(201).json({
      success: true,
      data: faq
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update FAQ
// @route   PUT /api/v1/faqs/:id
// @access  Private/Admin
exports.updateFAQ = async (req, res, next) => {
  try {
    const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!faq) {
      return res.status(404).json({ success: false, message: 'FAQ not found' });
    }

    res.status(200).json({
      success: true,
      data: faq
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete FAQ
// @route   DELETE /api/v1/faqs/:id
// @access  Private/Admin
exports.deleteFAQ = async (req, res, next) => {
  try {
    const faq = await FAQ.findByIdAndDelete(req.params.id);

    if (!faq) {
      return res.status(404).json({ success: false, message: 'FAQ not found' });
    }

    res.status(200).json({
      success: true,
      message: 'FAQ deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
