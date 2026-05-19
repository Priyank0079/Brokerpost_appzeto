const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();

// Middlewares
app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      process.env.CLIENT_URL, 
      'http://localhost:5173', 
      'http://localhost:5174', 
      'http://localhost:5175',
      'https://brokerpost-appzeto.vercel.app',
      'https://brokerpost-appzeto.onrender.com'
    ];
    
    // Check if origin is in allowedOrigins or if it's a development environment
    const isAllowed = allowedOrigins.some(allowed => allowed && (origin === allowed || origin.startsWith(allowed)));
    
    if (isAllowed || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      console.error(`CORS Error: Origin ${origin} not allowed`);
      const error = new Error('Not allowed by CORS');
      error.statusCode = 403;
      callback(error);
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to BrokerPost API' });
});



// Import Routes
const authRoutes = require('./routes/authRoutes');
const postingRoutes = require('./routes/postingRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const faqRoutes = require('./routes/faqRoutes');
const landingConfigRoutes = require('./routes/landingConfigRoutes');

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/postings', postingRoutes);
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/groups', require('./routes/groupRoutes'));
app.use('/api/v1/banners', require('./routes/carouselRoutes'));
app.use('/api/v1/faqs', faqRoutes);
app.use('/api/v1/landing-config', landingConfigRoutes);




// Error handling middleware
app.use((err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(val => val.message).join(', ');
  }

  // Handle Mongoose Duplicate Key Error
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already registered`;
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

module.exports = app;
