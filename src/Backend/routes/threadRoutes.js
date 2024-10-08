const express = require('express');
const { createThread, getThreads, getThreadByCategoryId} = require('../controllers/threadController');
const router = express.Router();

router.post('/threads', createThread);
router.get('/threads', getThreads);


module.exports = router;
