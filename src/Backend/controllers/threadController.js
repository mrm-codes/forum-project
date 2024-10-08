const Thread = require('../models/Thread');
const Post = require('../models/Post');

exports.createThread = async (req, res) => {
  try {
    const { title } = req.body;
    const thread = await Thread.create({ title, userId: req.user.id });
    res.status(201).json(thread);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getThreads = async (req, res) => {
  const threads = await Thread.findAll();
  res.json(threads);
};
