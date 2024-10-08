const Thread = require('../models/Thread');
const Post = require('../models/Post');
const User = require('../models/User');
const Category = require('../models/Category');
const jwt = require('jsonwebtoken');


// Authenticatio Middleware to extratct user ID from JWT token
// Helper function to extract and verify token
const verifyToken = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token, authorization denied');
  } else {
    console.log('Token found and verified');
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
    console.log('User ID:', req.user); // Log user ID for debugging purposes
    next();
    console.log('Authentication successful');
  } catch (err) {
    res.status(401).json({ message: err.message }); // Send error response if token is invalid
  }
};

// Improved createThread function
exports.createThread = [authMiddleware, async (req, res) => {
  try {
    
    const { title, categoryId } = req.body;
    
    console.log(`Title: ${title}, Category ID: ${categoryId} `);

    const user = await User.findByPk(req.user);
    //Validating user
    if (!user){
      return res.status(401).json({ message: 'Unauthorized: User not found' })
    } else {
      console.log('User:', user.username); // Log user ID for debugging purposes
    }

    // Validate the input
    if (!title || title.trim().length === 0) {
      return res.status(400).json({ error: 'Title is required.' });
    }
 
    if (title.length > 255) {
      return res.status(400).json({ error: 'Title should be less than 255 characters.' });
    }

    
    // Create a new thread
    const thread = await Thread.create({ title, userId: req.user, categoryId  });

    // Send the response with status 201 (Created)
    res.status(201).json(thread);
  } catch (err) {
    // Check for validation error from Sequelize
    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: 'Validation error.', details: err.errors });
    }

    // General error response
    res.status(500).json({ error: 'Internal server error. Please try again later.', details: err.message });
  }
}];


// Get all threads
exports.getThreads = async (req, res) => {
  try {
    // Get all threads
    const threads = await Thread.findAll({
      include: {
        model: User, 
        attributes: ['username'],
      }, 
    
      attributes: [ 'id', 'title', 'categoryId', 'createdAt'],
      order: [['createdAt', 'DESC']],
    });

    // Send the response with status 200 (OK)
    res.json(threads);
  } catch (err) {
    // General error response
    res.status(500).json({ error: 'Internal server error. Please try again later.' });
  }
};