const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title:      String,
  topic:      String,
  difficulty: { type: String, default: 'Medium' },
  questions: [{
    question:      String,
    options:       [String],
    correctAnswer: Number,
    explanation:   String,
  }],
  createdBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  testId:     { type: String, unique: true, sparse: true },
  isAssigned: { type: Boolean, default: false },
  assignedBy: { type: String },        // teacher name
  expiresAt:  { type: Date },          // optional expiry
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);