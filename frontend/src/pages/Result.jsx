import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import api from '../api/axios';

export default function Result() {
  const { id } = useParams();
  const location = useLocation();
  const [attempt, setAttempt] = useState(location.state?.attempt || null);
  const [loading, setLoading] = useState(!location.state?.attempt);
  const [error, setError] = useState('');

  useEffect(() => {
    if (attempt) return;

    api
      .get(`/test/history/${id}`)
      .then((res) => setAttempt(res.data.attempt))
      .catch(() => setError('Could not load test result.'))
      .finally(() => setLoading(false));
  }, [id, attempt]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 text-sm text-gray-600">
        Loading result...
      </div>
    );
  }

  if (error || !attempt) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 text-sm text-red-700">
        {error || 'Result not found.'}
      </div>
    );
  }

  const percentage = Math.round(
    (attempt.score / attempt.totalQuestions) * 100
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Summary Header */}
      <div className="bg-white border border-gray-200 rounded-md p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Test Result</h1>
          <p className="text-sm text-gray-500 mt-1">
            Submitted on {new Date(attempt.submittedAt).toLocaleString()}
          </p>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              {attempt.score} / {attempt.totalQuestions}
            </div>
            <div className="text-sm text-gray-600">{percentage}% Score</div>
          </div>

          <div className="flex gap-2">
            <Link
              to="/test"
              className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
              Retake Test
            </Link>
            <Link
              to="/history"
              className="px-4 py-2 text-sm font-medium border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
            >
              History
            </Link>
          </div>
        </div>
      </div>

      {/* Question-by-question breakdown */}
      <div className="space-y-4">
        {attempt.answers.map((item, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-md p-5"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <h2 className="text-sm font-medium text-gray-900">
                {index + 1}. {item.questionText}
              </h2>
              <span
                className={`shrink-0 text-xs font-medium px-2.5 py-0.5 rounded border ${
                  item.isCorrect
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'bg-red-50 text-red-700 border-red-200'
                }`}
              >
                {item.isCorrect ? 'Correct' : 'Incorrect'}
              </span>
            </div>

            <div className="space-y-1.5 text-sm">
              {item.options.map((opt, optIdx) => {
                const isCorrectOpt = optIdx === item.correctAnswer;
                const isUserOpt = optIdx === item.selectedOption;

                let rowClass = 'border-gray-200 bg-white text-gray-700';
                if (isCorrectOpt) {
                  rowClass = 'border-green-300 bg-green-50 text-green-900 font-medium';
                } else if (isUserOpt && !item.isCorrect) {
                  rowClass = 'border-red-300 bg-red-50 text-red-900';
                }

                return (
                  <div
                    key={optIdx}
                    className={`px-3 py-2 border rounded flex items-center justify-between ${rowClass}`}
                  >
                    <span>{opt}</span>
                    <span className="text-xs">
                      {isCorrectOpt && 'Correct Answer'}
                      {!isCorrectOpt && isUserOpt && 'Your Answer'}
                    </span>
                  </div>
                );
              })}
            </div>

            {item.selectedOption === null && (
              <p className="mt-2 text-xs text-gray-500">Not answered</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
