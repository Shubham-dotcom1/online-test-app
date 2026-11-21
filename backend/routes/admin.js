const express = require('express');
const Question = require('../models/Question');
const User = require('../models/User');
const Attempt = require('../models/Attempt');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// GET /api/admin/stats - Platform stats for admin dashboard
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const [totalQuestions, totalStudents, totalAttempts, categories] =
      await Promise.all([
        Question.countDocuments(),
        User.countDocuments({ role: 'student' }),
        Attempt.countDocuments(),
        Question.distinct('category'),
      ]);

    res.json({
      totalQuestions,
      totalStudents,
      totalAttempts,
      categoriesCount: categories.length,
      categories,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch platform metrics' });
  }
});

// GET /api/admin/attempts - View student submission audit logs
router.get('/attempts', protect, adminOnly, async (req, res) => {
  try {
    const attempts = await Attempt.find()
      .populate('userId', 'name email')
      .sort({ submittedAt: -1 })
      .limit(50);

    res.json({ attempts });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch submission logs' });
  }
});

// GET /api/admin/questions - List all questions with answers
router.get('/questions', protect, adminOnly, async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });
    res.json({ questions });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch questions' });
  }
});

// POST /api/admin/questions - Add a new question with strict validation
router.post('/questions', protect, adminOnly, async (req, res) => {
  try {
    const { questionText, options, correctAnswer, category } = req.body;

    // Strict validation
    if (
      !questionText ||
      typeof questionText !== 'string' ||
      questionText.trim().length < 5 ||
      questionText.trim().length > 1000
    ) {
      return res.status(400).json({
        message: 'Question text must be between 5 and 1000 characters',
      });
    }

    if (
      !Array.isArray(options) ||
      options.length !== 4 ||
      options.some(
        (opt) => !opt || typeof opt !== 'string' || !opt.trim() || opt.trim().length > 300
      )
    ) {
      return res.status(400).json({
        message: 'Exactly 4 non-empty options (max 300 characters each) are required',
      });
    }

    const answerIndex = Number(correctAnswer);
    if (!Number.isInteger(answerIndex) || answerIndex < 0 || answerIndex > 3) {
      return res
        .status(400)
        .json({ message: 'Correct answer index must be an integer between 0 and 3' });
    }

    const sanitizedCategory =
      typeof category === 'string' && category.trim()
        ? category.trim().substring(0, 50)
        : 'General CS';

    const question = await Question.create({
      questionText: questionText.trim(),
      options: options.map((o) => o.trim()),
      correctAnswer: answerIndex,
      category: sanitizedCategory,
    });

    res.status(201).json({ question });
  } catch (err) {
    res.status(500).json({ message: 'Server error while adding question' });
  }
});

// DELETE /api/admin/questions/:id - Securely delete a question
router.delete('/questions/:id', protect, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid question ID format' });
    }

    const deleted = await Question.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json({ message: 'Question deleted successfully', id });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete question' });
  }
});

module.exports = router;
