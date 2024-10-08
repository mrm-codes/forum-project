const express = require('express');
const { check } = require('express-validator');
const { register, login } = require('../controllers/authController');
const router = express.Router();

// Middleware to validate registration input
const validateRegistration = [
  check('username').notEmpty().withMessage('Username is required'),
  check('email').isEmail().withMessage('Valid email is required'),
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

// Middleware to validate login input
const validateLogin = [
  check('email').isEmail().withMessage('Valid email is required'),
  check('password').notEmpty().withMessage('Password is required'),
];

// Route to register a new user
router.post('/register', validateRegistration, register);

// Route to log in a user
router.post('/login', validateLogin, login);

module.exports = router;
