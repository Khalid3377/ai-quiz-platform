const router = require('express').Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const User = require('../models/User');
const Quiz = require('../models/Quiz');

router.use(auth, admin);

// GET stats
router.get('/stats', async (req, res) => {
  try {
    const totalUsers   = await User.countDocuments();
    const totalQuizzes = await Quiz.countDocuments();
    const topUser      = await User.findOne()
      .sort({ score: -1 })
      .select('name score');
    res.json({ totalUsers, totalQuizzes, topUser });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// GET all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// DELETE a user
router.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: 'User deleted' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// GET all quizzes
router.get('/quizzes', async (req, res) => {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// DELETE a quiz
router.delete('/quizzes/:id', async (req, res) => {
  try {
    await Quiz.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Quiz deleted' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Make user admin
router.put('/users/:id/make-admin', async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { role: 'admin' });
    res.json({ msg: 'User is now admin' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;