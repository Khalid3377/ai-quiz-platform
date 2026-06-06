const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth',    require('./routes/auth'));
app.use('/api/quizzes', require('./routes/quiz'));
app.use('/api/results', require('./routes/results'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/pdf',     require('./routes/pdf'));
app.use('/api/admin',   require('./routes/admin'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ msg: err.message });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ DB Error:', err));

app.listen(process.env.PORT || 5000, () =>
  console.log(`🚀 Server on port ${process.env.PORT || 5000}`));