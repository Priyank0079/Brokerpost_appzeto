const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a description']
  },
  type: {
    type: String,
    enum: ['Residential', 'Commercial'],
    required: true
  },
  category: {
    type: String,
    enum: ['Flat', 'House', 'Plot', 'Office', 'Shop', 'Warehouse'],
    required: true
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price']
  },
  location: {
    address: String,
    city: String,
    state: String,
    zipCode: String
  },
  features: {
    bedrooms: Number,
    bathrooms: Number,
    area: Number, // In sqft
    furnishing: {
      type: String,
      enum: ['Unfurnished', 'Semi-furnished', 'Fully-furnished']
    }
  },
  images: [String],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['Available', 'Sold', 'Rented'],
    default: 'Available'
  }
}, {
  timestamps: true
});

const Property = mongoose.model('Property', propertySchema);

module.exports = Property;
