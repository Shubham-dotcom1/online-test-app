import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function History() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/test/history')
      .then((res) => setAttempts(res.data.attempts))
      .catch(() => setError('Failed to load history.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Test History</h1>
          <p className="text-sm text-gray-600 mt-1">
            Your previous test submissions and scores.
          </p>
        </div>
        <Link
          to="/test"
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded"
        >
          Take New Test
        </Link>
      </div>

      {loading ? (
        <p className="text-sm text-gray-600">Loading attempts...</p>
      ) : error ? (
        <p className="text-sm text-red-700">{error}</p>
      ) : attempts.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-md p-8 text-center text-sm text-gray-600">
          You haven't taken any tests yet.
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
              <tr>
                <th className="py-3 px-4 font-medium">#</th>
                <th className="py-3 px-4 font-medium">Date & Time</th>
                <th className="py-3 px-4 font-medium">Score</th>
                <th className="py-3 px-4 font-medium">Percentage</th>
                <th className="py-3 px-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {attempts.map((attempt, idx) => {
                const pct = Math.round(
                  (attempt.score / attempt.totalQuestions) * 100
                );
                return (
                  <tr key={attempt._id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-500">
                      {attempts.length - idx}
                    </td>
                    <td className="py-3 px-4 text-gray-900">
                      {new Date(attempt.submittedAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">
                      {attempt.score} / {attempt.totalQuestions}
                    </td>
                    <td className="py-3 px-4 text-gray-700">{pct}%</td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to={`/result/${attempt._id}`}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        View Result
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
