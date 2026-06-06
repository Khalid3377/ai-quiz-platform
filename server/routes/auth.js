const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: 'Please fill all fields' });
    }

    if (password.length < 6) {
      return res.status(400).json({ msg: 'Password must be at least 6 characters' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ msg: 'Email already exists' });
    }

    const user = await User.create({ name, email, password });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
  token,
  user: { id: user._id, name: user.name, email: user.email, role: user.role }
});

  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ msg: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: 'Please fill all fields' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
  token,
  user: { id: user._id, name: user.name, email: user.email, role: user.role }
});

  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ msg: err.message });
  }
});

// Secret admin registration
router.post('/register-admin', async (req, res) => {
  try {
    const { name, email, password, secretCode } = req.body;

    // Check secret code
    if (secretCode !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ msg: 'Invalid secret code' });
    }

    // Check if email exists
    if (await User.findOne({ email })) {
      return res.status(400).json({ msg: 'Email already exists' });
    }

    // Create admin user
    const user = await User.create({
      name,
      email,
      password,
      role: 'admin'
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: 'admin' }
    });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});



module.exports = router;