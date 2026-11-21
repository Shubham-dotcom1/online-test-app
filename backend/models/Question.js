const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
      required: true,
      trim: true,
    },
    options: {
      type: [String],
      required: true,
      validate: {
        validator: (arr) => arr.length === 4,
        message: 'A question must have exactly 4 options.',
      },
    },
    correctAnswer: {
      type: Number,
      required: true,
      min: 0,
      max: 3,
    },
    category: {
      type: String,
      default: 'General CS',
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Question', questionSchema);
