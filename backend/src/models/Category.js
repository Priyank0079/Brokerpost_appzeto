const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  vertical: { 
    type: String, 
    required: [true, 'Vertical is required'],
    enum: ['RESIDENTIAL', 'COMMERCIAL']
  },
  intent: { 
    type: String, 
    required: [true, 'Intent is required']
  },
  name: { 
    type: String, 
    required: [true, 'Category name is required'],
    trim: true
  },
  subCategories: [{ 
    type: String,
    trim: true
  }],
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, { timestamps: true });

// Ensure unique combination of vertical, intent, and name
categorySchema.index({ vertical: 1, intent: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Category', categorySchema);
