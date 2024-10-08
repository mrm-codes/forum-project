const express = require('express');
const { createThread, getThreads } = require('../controllers/threadController');
const router = express.Router();

router.post('/threads', createThread);
router.get('/threads', getThreads);

module.exports = router;
