const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validationResult } = require('express-validator'); // If using express-validator

// Constants
const SALT_ROUNDS = 10;
const TOKEN_EXPIRY = '5h'; // Token expires in 5 hour



// Helper to generate JWT token
const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: TOKEN_EXPIRY,
  });
};


// Registering / Create a new user
exports.register = async (req, res) => {
  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password, email } = req.body;

  try {
    // Check if email is already taken
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already in use' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create a new user
    const user = await User.create({
      username,
      password: hashedPassword,
      email,
    });

    // Return success response without sensitive information
    res.status(201).json({ 
      message: 'User registered', 
      user: { id: user.id, username: user.username, email: user.email } 
    });

  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

// Login a user or authenticate an existing user
exports.login = async (req, res) => {
  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the input password with the stored hash
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateToken(user);

    // Return the token and user information
    res.json({ 
      token, 
      user: { id: user.id, email: user.email, username: user.username } 
    });

  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};