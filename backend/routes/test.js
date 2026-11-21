const express = require('express');
const Question = require('../models/Question');
const Attempt = require('../models/Attempt');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/test/questions - Fetch 10 random questions without correctAnswer
router.get('/questions', protect, async (req, res) => {
  try {
    const questions = await Question.aggregate([
      { $sample: { size: 10 } },
      { $project: { correctAnswer: 0 } },
    ]);

    res.json({ questions });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load questions' });
  }
});

// POST /api/test/submit - Grade answers on server and save attempt
router.post('/submit', protect, async (req, res) => {
  try {
    const { questionIds, answers } = req.body;
    // questionIds: string[] (ordered list of questions shown in the test)
    // answers: { [questionId]: number | null }

    if (!Array.isArray(questionIds) || questionIds.length === 0) {
      return res.status(400).json({ message: 'Invalid test submission' });
    }

    const dbQuestions = await Question.find({ _id: { $in: questionIds } });
    const questionMap = new Map(
      dbQuestions.map((q) => [q._id.toString(), q])
    );

    let score = 0;
    const evaluatedAnswers = [];

    for (const qId of questionIds) {
      const q = questionMap.get(qId);
      if (!q) continue;

      const selected =
        answers && answers[qId] !== undefined && answers[qId] !== null
          ? Number(answers[qId])
          : null;

      const isCorrect = selected !== null && selected === q.correctAnswer;
      if (isCorrect) score += 1;

      evaluatedAnswers.push({
        questionId: q._id,
        questionText: q.questionText,
        options: q.options,
        selectedOption: selected,
        correctAnswer: q.correctAnswer,
        isCorrect,
      });
    }

    const attempt = await Attempt.create({
      userId: req.user._id,
      score,
      totalQuestions: evaluatedAnswers.length,
      answers: evaluatedAnswers,
    });

    res.status(201).json({ attempt });
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit test' });
  }
});

// GET /api/test/history - List past attempts for logged-in user
router.get('/history', protect, async (req, res) => {
  try {
    const attempts = await Attempt.find({ userId: req.user._id })
      .select('score totalQuestions submittedAt')
      .sort({ submittedAt: -1 });

    res.json({ attempts });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load test history' });
  }
});

// GET /api/test/history/:id - Get full breakdown for a single attempt
router.get('/history/:id', protect, async (req, res) => {
  try {
    const attempt = await Attempt.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!attempt) {
      return res.status(404).json({ message: 'Attempt not found' });
    }

    res.json({ attempt });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load attempt details' });
  }
});

module.exports = router;
