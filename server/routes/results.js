const router = require('express').Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const User = require('../models/User');

const resultSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userName:    String,
  userEmail:   String,
  quiz:        { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
  quizTitle:   String,
  topic:       String,
  testId:      String,
  score:       Number,
  totalQ:      Number,
  timeTaken:   Number,
  answers:     [Number],
}, { timestamps: true });

const Result = mongoose.models.Result ||
  mongoose.model('Result', resultSchema);

router.Result = Result;

// Submit quiz result
router.post('/submit', auth, async (req, res) => {
  try {
    const { quizId, answers, timeTaken, quiz } = req.body;

    if (!quiz || !quiz.questions) {
      return res.status(400).json({ msg: 'Invalid quiz data' });
    }

    let score = 0;
    const wrongTopics = [];

    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) {
        score++;
      } else {
        wrongTopics.push(quiz.topic);
      }
    });

    // Get user details
    const user = await User.findById(req.user.id).select('name email');

    await Result.create({
      user:      req.user.id,
      userName:  user.name,
      userEmail: user.email,
      quiz:      quizId,
      quizTitle: quiz.title,
      topic:     quiz.topic,
      testId:    quiz.testId || null,
      score,
      totalQ:    quiz.questions.length,
      timeTaken,
      answers,
    });

    await User.findByIdAndUpdate(req.user.id, {
      $inc:      { score },
      $addToSet: { weakTopics: { $each: wrongTopics } },
    });

    res.json({
      score,
      total:      quiz.questions.length,
      percentage: ((score / quiz.questions.length) * 100).toFixed(1),
    });

  } catch (err) {
    console.error('Submit error:', err.message);
    res.status(500).json({ msg: err.message });
  }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const board = await User.find()
      .select('name score')
      .sort({ score: -1 })
      .limit(10);
    res.json(board);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Get user history
router.get('/history', auth, async (req, res) => {
  try {
    const results = await Result.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(results);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Get all responses for a specific Test ID (teacher view)
router.get('/test/:testId', auth, async (req, res) => {
  try {
    const results = await Result.find({
      testId: req.params.testId.toUpperCase()
    }).sort({ createdAt: -1 });
    res.json(results);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;