const express = require('express');
const { createCategory, getCategories } = require('../controllers/categoryController')

const router = express.Router();

// Creating Categories
router.post('/category', createCategory);

// Accessing all Categories
router.get('/categories', getCategories);

module.exports = router;