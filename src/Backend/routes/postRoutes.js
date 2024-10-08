const express = require('express');
const { createPost, getPostsByThread } = require('../controllers/postController');
const router = express.Router();

router.post('/post', createPost);
router.get('/threads/posts', getPostsByThread);

module.exports = router;
