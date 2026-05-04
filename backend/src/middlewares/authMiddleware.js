const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');


const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      if (!token || token === 'null' || token === 'undefined') {
        return res.status(401).json({ success: false, message: 'Not authorized, invalid token' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user/admin from the token using the model claim
      const userModel = decoded.model || 'User'; // Fallback to 'User' for older tokens
      let foundUser;
      
      if (userModel === 'Admin') {
        foundUser = await Admin.findById(decoded.id).select('-password');
      } else {
        foundUser = await User.findById(decoded.id).select('-password');
      }
      
      if (!foundUser) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }

      req.user = foundUser;
      req.userModel = userModel;




      next();
    } catch (error) {
      console.error('JWT Error:', error.message);
      res.status(401).json({ 
        success: false, 
        message: error.name === 'TokenExpiredError' ? 'Token expired' : 'Not authorized, token failed' 
      });
    }
  }

  if (!token) {
    res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    console.log(`Checking authorization: User role [${req.user.role}], required roles [${roles.join(', ')}]`);
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
