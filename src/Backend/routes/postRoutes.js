const express = require('express');
const { createPost, getPostsByThread } = require('../controllers/postController');
const router = express.Router();

router.post('/posts', createPost);
router.get('/threads/:threadId/posts', getPostsByThread);

module.exports = router;
