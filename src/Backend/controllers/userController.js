
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper function to extract and verify token
const verifyToken = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token, authorization denied');
  }
  
  const token = authHeader.split(' ')[1]; // Extract token
  try {
    return jwt.verify(token, process.env.JWT_SECRET); // Verify token
  } catch (err) {
    throw new Error('Token is not valid');
  }
};

// Middleware to authenticate and extract user ID from token
const authMiddleware = (req, res, next) => {
  try {
    const decoded = verifyToken(req); // Use helper to verify token
    req.user = decoded.id; // Store user ID in req.user for further use
    next();
  } catch (err) {
    res.status(401).json({ message: err.message }); // Send error response if token is invalid
  }
};

// Get User by ID
exports.getUserById = [authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user, {
      attributes: ['id', 'username', 'email'],  // Exclude password from response
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user); // Send back user details
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error, please try again later.' });
  }
}];

// Get Username list

exports.getUsernames = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: ['username'] }); // Fetch usernames only

    if (!users.length) {
      return res.status(404).json({ message: 'No users found' });
    }

    res.json(users); // Send back usernames
  } catch (error) {
    console.error('Error fetching usernames:', error);
    res.status(500).json({ message: 'Server error, please try again later.' });
  }
};

// User Logout

exports.logoutUser = (req, res) => {
  res.clearCookie('token'); // Clear token from cookies
  res.json({ message: 'User logged out' });
};
