const router = require('express').Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

const Result = require('./results').Result;

router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;