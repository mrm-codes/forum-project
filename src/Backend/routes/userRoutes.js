const express = require('express');
const router = express.Router();
const { authMiddleware, getUserById, logoutUser, getUsernames } = require('../controllers/userController');

// Route to get the authenticated user (using /me to refer to current user)
router.get('/me', getUserById); // Apply authentication middleware
router.get('/usernames', getUsernames);
// Loggout the authenticated user
router.get('/logout', logoutUser);

module.exports = router;
