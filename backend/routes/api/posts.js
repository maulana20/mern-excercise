const express = require('express');
const router = express.Router();

const auth = require('../../middleware/auth');
const Post = require('../../models/Post');

router.get('/', auth, async (req, res) => {
  const posts = await Post.find().sort({ date: -1 });
  res.json(posts);
});

module.exports = router;
