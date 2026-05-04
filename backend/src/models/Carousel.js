const mongoose = require('mongoose');

const carouselSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a banner headline'],
    trim: true
  },
  subtitle: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    required: [true, 'Please provide an image']
  },
  link: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Carousel = mongoose.model('Carousel', carouselSchema);

module.exports = Carousel;
