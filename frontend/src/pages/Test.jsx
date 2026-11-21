import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const DURATION_SECONDS = 10 * 60; // 10 minutes

export default function Test() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(DURATION_SECONDS);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const answersRef = useRef({});
  const questionsRef = useRef([]);
  const submittedRef = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get('/test/questions')
      .then((res) => {
        setQuestions(res.data.questions);
        questionsRef.current = res.data.questions;
      })
      .catch(() => setError('Failed to load test questions.'))
      .finally(() => setLoading(false));
  }, []);

  const submitTest = useCallback(async () => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    setSubmitting(true);

    try {
      const questionIds = questionsRef.current.map((q) => q._id);
      const res = await api.post('/test/submit', {
        questionIds,
        answers: answersRef.current,
      });
      navigate(`/result/${res.data.attempt._id}`, {
        state: { attempt: res.data.attempt },
        replace: true,
      });
    } catch (err) {
      submittedRef.current = false;
      setSubmitting(false);
      setError('Failed to submit test. Please try again.');
    }
  }, [navigate]);

  useEffect(() => {
    if (loading || questions.length === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          submitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, questions.length, submitTest]);

  const handleSelectOption = (questionId, optionIndex) => {
    const updated = { ...answers, [questionId]: optionIndex };
    setAnswers(updated);
    answersRef.current = updated;
  };

  const handleManualSubmit = () => {
    const answeredCount = Object.keys(answers).length;
    const unanswered = questions.length - answeredCount;
    const message =
      unanswered > 0
        ? `You have ${unanswered} unanswered question(s). Submit anyway?`
        : 'Are you sure you want to submit the test?';

    if (window.confirm(message)) {
      submitTest();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-sm text-gray-600">
        Loading test questions...
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="bg-white border border-gray-200 rounded-md p-6 text-sm text-red-700">
          {error || 'No questions available in the database.'}
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Top status bar */}
      <div className="bg-white border border-gray-200 rounded-md px-5 py-3 mb-5 flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Question <span className="font-semibold">{currentIndex + 1}</span> of{' '}
          <span className="font-semibold">{questions.length}</span>
          <span className="mx-3 text-gray-300">|</span>
          Answered: <span className="font-semibold">{answeredCount}</span>/
          {questions.length}
        </div>

        <div
          className={`font-mono text-sm font-semibold px-3 py-1 rounded border ${
            timeLeft <= 60
              ? 'bg-red-50 text-red-700 border-red-200'
              : 'bg-gray-50 text-gray-900 border-gray-200'
          }`}
        >
          Time Left: {formatTime(timeLeft)}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {/* Main question card */}
        <div className="md:col-span-3 bg-white border border-gray-200 rounded-md p-6 flex flex-col justify-between min-h-[380px]">
          <div>
            {currentQuestion.category && (
              <span className="inline-block text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded mb-3">
                {currentQuestion.category}
              </span>
            )}

            <h2 className="text-base font-medium text-gray-900 mb-5 leading-relaxed">
              {currentIndex + 1}. {currentQuestion.questionText}
            </h2>

            <div className="space-y-2.5">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = answers[currentQuestion._id] === idx;
                return (
                  <label
                    key={idx}
                    className={`flex items-start gap-3 p-3.5 border rounded cursor-pointer text-sm ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 text-gray-900'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-800'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestion._id}`}
                      checked={isSelected}
                      onChange={() =>
                        handleSelectOption(currentQuestion._id, idx)
                      }
                      className="mt-0.5 accent-blue-600"
                    />
                    <span>{option}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-200">
            <button
              type="button"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((i) => i - 1)}
              className="px-4 py-2 text-sm font-medium border border-gray-300 rounded text-gray-700 hover:bg-gray-50 disabled:opacity-40"
            >
              Previous
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentIndex((i) => i + 1)}
                className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                disabled={submitting}
                onClick={handleManualSubmit}
                className="px-5 py-2 text-sm font-medium bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded"
              >
                {submitting ? 'Submitting...' : 'Submit Test'}
              </button>
            )}
          </div>
        </div>

        {/* Question palette sidebar */}
        <div className="bg-white border border-gray-200 rounded-md p-4 h-fit">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Questions
          </h3>
          <div className="grid grid-cols-5 gap-2 mb-5">
            {questions.map((q, idx) => {
              const isCurrent = idx === currentIndex;
              const isAnswered = answers[q._id] !== undefined;

              let btnClass = 'border-gray-300 text-gray-700 bg-white';
              if (isCurrent) {
                btnClass = 'border-blue-600 bg-blue-600 text-white';
              } else if (isAnswered) {
                btnClass = 'border-green-600 bg-green-50 text-green-800';
              }

              return (
                <button
                  key={q._id}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-9 text-xs font-medium border rounded ${btnClass}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            disabled={submitting}
            onClick={handleManualSubmit}
            className="w-full py-2 text-sm font-medium border border-gray-300 rounded text-gray-800 hover:bg-gray-50 disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Finish & Submit'}
          </button>
        </div>
      </div>
    </div>
  );
}
