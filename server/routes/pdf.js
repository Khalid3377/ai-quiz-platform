const router = require('express').Router();
const multer = require('multer');
const pdfParse = require('pdf-parse');
const Groq = require('groq-sdk');
const Quiz = require('../models/Quiz');
const auth = require('../middleware/auth');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

router.post(
  '/generate',
  auth,
  upload.single('pdf'),
  async (req, res) => {
    try {

      if (!req.file) {
        return res.status(400).json({
          msg: 'Please upload a PDF file'
        });
      }

      const {
        difficulty = 'Medium',
        numQuestions = 10
      } = req.body;

      console.log('PDF received:', req.file.originalname);

      const pdfData = await pdfParse(req.file.buffer);

      const text = pdfData.text;

      console.log('Text length:', text.length);

      if (!text || text.trim().length < 50) {
        return res.status(400).json({
          msg: 'Could not extract enough text from PDF'
        });
      }

      const limitedText = text.substring(0, 3000);

      const prompt = `
Generate ${numQuestions} MCQ questions from the following notes.

Difficulty: ${difficulty}

Return ONLY valid JSON.

Format:

[
  {
    "question": "...",
    "options": ["A","B","C","D"],
    "correctAnswer": 0,
    "explanation": "..."
  }
]

Notes:

${limitedText}
`;

      const completion =
        await groq.chat.completions.create({
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          model: 'llama-3.3-70b-versatile',
          temperature: 0.7
        });

      const raw =
        completion.choices[0].message.content;

      const cleaned = raw
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

      const questions = JSON.parse(cleaned);

      const { assignToStudents } = req.body;
const User = require('../models/User');
const user = await User.findById(req.user.id).select('name');

let testId = null;
if (assignToStudents === 'true') {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  testId = 'TEST-';
  for (let i = 0; i < 5; i++) {
    testId += chars.charAt(Math.floor(Math.random() * chars.length));
  }
}

const quiz = await Quiz.create({
  title:      `PDF Quiz — ${req.file.originalname} (${difficulty})`,
  topic:      'PDF Upload',
  difficulty,
  questions,
  createdBy:  req.user.id,
  testId,
  isAssigned: assignToStudents === 'true',
  assignedBy: user?.name || 'Teacher',
});

      res.json(quiz);

    } catch (err) {

      console.log('PDF ERROR:');
      console.log(err);

      res.status(500).json({
        msg: err.message
      });
    }
  }
);

module.exports = router;