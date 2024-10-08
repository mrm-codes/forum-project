const Post = require('../models/Post');

exports.createPost = async (req, res) => {
  try {
    const { content, threadId } = req.body;
    const post = await Post.create({ content, threadId, userId: req.user.id });
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPostsByThread = async (req, res) => {
  const { threadId } = req.params;
  const posts = await Post.findAll({ where: { threadId } });
  res.json(posts);
};