const mongoose = require('mongoose');

const postingSchema = new mongoose.Schema({
  // ── WHO POSTED ──────────────────────────────────────────────────────────────
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  // ── CLASSIFICATION (drives field visibility in frontend) ─────────────────────
  vertical: {
    type: String,
    enum: ['RESIDENTIAL', 'COMMERCIAL'],
    required: [true, 'Vertical is required'],
    index: true
  },
  postType: {
    type: String,
    enum: ['REQUIREMENT', 'AVAILABILITY'],
    required: [true, 'Post type is required'],
    index: true
  },
  intent: {
    type: String,
    enum: ['PURCHASE', 'RENT', 'SALE', 'RENTALS', 'LEASE'],
    required: [true, 'Intent is required'],
    index: true
  },
  subType: {
    type: String,
    enum: [
      // Residential
      'APARTMENTS',
      'LOW_RISE_FLOORS',
      'KOTHI_VILLAS',
      'PLOTS',
      // Commercial
      'SHOP_SHOWROOM',
      'OFFICE',
      'WAREHOUSE',
      'STANDALONE_BUILDING',
      'PLOT',
      'COMMERCIAL_APARTMENTS'
    ],
    required: [true, 'Sub-type is required'],
    index: true
  },

  // ── LOCATION ────────────────────────────────────────────────────────────────
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    index: true
  },
  project: {
    type: String,
    trim: true
  },

  // ── SIZE ─────────────────────────────────────────────────────────────────────
  size: {
    type: Number,
    min: [1, 'Size must be greater than 0']
  },
  sizeUnit: {
    type: String,
    enum: ['SQ_FT', 'SQ_YD', 'SQ_MT'],
    default: 'SQ_FT'
  },

  // ── BHK ──────────────────────────────────────────────────────────────────────
  bedrooms: {
    type: String,
    enum: ['1', '2', '3', '4', '5+']
  },

  // ── PRICE RATE (for Availability) ────────────────────────────────────────────
  priceRate: {
    type: Number,
    min: 0
  },
  priceRateType: {
    type: String,
    enum: ['PER_SQFT', 'PER_SQYD', 'PER_SQMT', 'LUMPSUM']
  },

  // ── TOTAL AMOUNT ─────────────────────────────────────────────────────────────
  // Used as: total_cost (Availability), total_rent (Lease Availability)
  totalAmount: {
    type: Number,
    min: 0
  },
  totalAmountUnit: {
    type: String,
    enum: ['THOUSAND', 'LAKH', 'CR'],
    default: 'LAKH'
  },

  // ── BUDGET RANGE (for Requirements) ──────────────────────────────────────────
  // Used as: budget_rent (Res Rent Req), total_budget (Purchase/Lease Req)
  budgetMin: {
    type: Number,
    min: 0
  },
  budgetMax: {
    type: Number,
    min: 0
  },
  budgetUnit: {
    type: String,
    enum: ['THOUSAND', 'LAKH', 'CR'],
    default: 'LAKH'
  },

  // ── SUPPLEMENTAL FIELDS ───────────────────────────────────────────────────────
  // Occupancy status — for Commercial availability
  occupancy: {
    type: String,
    enum: ['VACANT', 'RENTED']
  },

  // Construction status — Residential & Commercial
  constructionStatus: {
    type: String,
    enum: ['READY', 'UNDER_CONSTRUCTION']
  },

  // Tenant preference — Residential Rent Requirements only
  tenantPreference: [{
    type: String,
    enum: ['STUDENTS', 'FAMILY', 'MNC', 'KOREAN', 'BUSINESSMAN']
  }],

  // Free-text note — Requirements only
  shortDescription: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    trim: true
  },

  // ── IMAGES ──────────────────────────────────────────────────────────────────
  images: {
    type: [String],
    validate: {
      validator: function(val) {
        return val.length <= 5;
      },
      message: 'A posting can have a maximum of 5 images'
    }
  },

  // ── STATUS ────────────────────────────────────────────────────────────────────
  isActive: {
    type: Boolean,
    default: true,
    index: true
  }

}, { timestamps: true });

// Compound index for fast match queries and filtered feed
postingSchema.index({
  vertical: 1,
  subType: 1,
  location: 1,
  intent: 1,
  postType: 1,
  isActive: 1
});

const Posting = mongoose.model('Posting', postingSchema);

module.exports = Posting;
