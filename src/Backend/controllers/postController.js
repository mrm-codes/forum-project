const Post = require('../models/Post');
const User = require('../models/User');
const jwt = require('jsonwebtoken');


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


exports.createPost = [authMiddleware, async (req, res) => {
  const user = await User.findByPk(req.user);
    //Validating user
  if (!user){
    return res.status(401).json({ message: 'Unauthorized: User not found' })
  } else {
    console.log('User:', user.username); // Log user ID for debugging purposes
  }

  try {
    const { content, threadId } = req.body;
    console.log(`Content: ${content} and threadId: ${threadId}`);


    const post = await Post.create({ content, threadId, userId: req.user });
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}];

exports.getPostsByThread = async (req, res) => {
 
  const posts = await Post.findAll({ 
    include: {
      model: User, 
      attributes: ['username'],
    },
    attributes: [ 'id', 'content', 'threadId', 'createdAt'],
      order: [['createdAt', 'DESC']],
  });
  res.json(posts);
};
