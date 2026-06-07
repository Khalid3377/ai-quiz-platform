const router  = require('express').Router();
const Groq    = require('groq-sdk');
const Quiz    = require('../models/Quiz');
const auth    = require('../middleware/auth');
const User    = require('../models/User');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

function generateTestId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'TEST-';
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// 1. Generate quiz
router.post('/generate', auth, async (req, res) => {
  try {
    const {
      topic,
      difficulty       = 'Medium',
      numQuestions     = 10,
      assignToStudents = false,
    } = req.body;

    console.log('Generating quiz for:', topic);

    const prompt = `Generate ${numQuestions} MCQ questions on "${topic}".
Difficulty: ${difficulty}.
Return ONLY a valid JSON array, no extra text, no markdown.
Format:
[
  {
    "question": "...",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": 0,
    "explanation": "..."
  }
]
correctAnswer is the index (0-3) of the correct option.`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
    });

    const raw       = completion.choices[0].message.content;
    const cleaned   = raw.replace(/```json/g, '').replace(/```/g, '').trim();
    const questions = JSON.parse(cleaned);

    const user   = await User.findById(req.user.id).select('name');
    const quizData = {
  title: `${topic} (${difficulty})`,
  topic,
  difficulty,
  questions,
  createdBy: req.user.id,
  isAssigned: assignToStudents,
  assignedBy: user?.name || 'Teacher',
};

if (assignToStudents) {
  quizData.testId = generateTestId();
}

const quiz = await Quiz.create(quizData);

    res.json(quiz);
  } catch (err) {
    console.log('FULL ERROR:', err.message);
    res.status(500).json({ msg: err.message });
  }
});

// 2. GET all public quizzes
router.get('/', async (req, res) => {
  try {
    const quizzes = await Quiz.find({ isAssigned: { $ne: true } })
      .select('title topic difficulty createdAt testId isAssigned')
      .sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// 3. GET teacher's assigned quizzes — BEFORE /:id
router.get('/my-tests', auth, async (req, res) => {
  try {
    const tests = await Quiz.find({
      createdBy:  req.user.id,
      isAssigned: true,
    }).sort({ createdAt: -1 });
    res.json(tests);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// 4. JOIN quiz by Test ID — BEFORE /:id
router.get('/join/:testId', auth, async (req, res) => {
  try {
    const quiz = await Quiz.findOne({
      testId: req.params.testId.toUpperCase()
    });
    if (!quiz) {
      return res.status(404).json({ msg: 'Invalid Test ID. Please check and try again.' });
    }
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// 5. GET single quiz by ID — ALWAYS LAST
router.get('/:id', auth, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ msg: 'Quiz not found' });
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;