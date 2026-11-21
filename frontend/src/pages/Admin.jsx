import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('questions'); // 'questions' | 'results'

  // Questions state
  const [questions, setQuestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  // Stats state
  const [stats, setStats] = useState({
    totalQuestions: 0,
    totalStudents: 0,
    totalAttempts: 0,
    categoriesCount: 0,
    categories: [],
  });

  // Test Results state
  const [attempts, setAttempts] = useState([]);

  // Add Question form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [category, setCategory] = useState('General CS');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // Delete modal state
  const [deletingQuestion, setDeletingQuestion] = useState(null);

  const fetchStats = () => {
    api
      .get('/admin/stats')
      .then((res) => setStats(res.data))
      .catch(() => {});
  };

  const fetchQuestions = () => {
    api
      .get('/admin/questions')
      .then((res) => setQuestions(res.data.questions))
      .catch(() => setError('Failed to load questions.'));
  };

  const fetchAttempts = () => {
    api
      .get('/admin/attempts')
      .then((res) => setAttempts(res.data.attempts))
      .catch(() => {});
  };

  useEffect(() => {
    fetchStats();
    fetchQuestions();
    fetchAttempts();
  }, []);

  const handleOptionChange = (index, value) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setSaving(true);

    try {
      await api.post('/admin/questions', {
        questionText: questionText.trim(),
        options: options.map((opt) => opt.trim()),
        correctAnswer: Number(correctAnswer),
        category: category.trim(),
      });

      setQuestionText('');
      setOptions(['', '', '', '']);
      setCorrectAnswer(0);
      setMessage('Question added successfully.');
      setShowAddForm(false);
      fetchQuestions();
      fetchStats();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add question.');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deletingQuestion) return;
    try {
      await api.delete(`/admin/questions/${deletingQuestion._id}`);
      setQuestions((prev) => prev.filter((q) => q._id !== deletingQuestion._id));
      setDeletingQuestion(null);
      setMessage('Question removed.');
      fetchStats();
    } catch {
      setError('Failed to delete question.');
    }
  };

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      q.questionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.options.some((opt) =>
        opt.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesCat =
      filterCategory === 'All' || q.category === filterCategory;
    return matchesSearch && matchesCat;
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage test questions, review student results, and track assessment activity.
          </p>
        </div>

        {activeTab === 'questions' && (
          <button
            onClick={() => {
              setShowAddForm(!showAddForm);
              setMessage('');
              setError('');
            }}
            className="self-start sm:self-auto bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md transition flex items-center gap-1.5"
          >
            <span>{showAddForm ? 'Cancel' : '+ Add Question'}</span>
          </button>
        )}
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="text-sm text-gray-500 font-medium">Total Questions</div>
          <div className="text-2xl font-semibold text-gray-900 mt-1">
            {stats.totalQuestions}
          </div>
          <div className="text-xs text-gray-400 mt-1">In question bank</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="text-sm text-gray-500 font-medium">Registered Students</div>
          <div className="text-2xl font-semibold text-gray-900 mt-1">
            {stats.totalStudents}
          </div>
          <div className="text-xs text-gray-400 mt-1">Student accounts</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="text-sm text-gray-500 font-medium">Tests Completed</div>
          <div className="text-2xl font-semibold text-gray-900 mt-1">
            {stats.totalAttempts}
          </div>
          <div className="text-xs text-gray-400 mt-1">Submissions recorded</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="text-sm text-gray-500 font-medium">Active Categories</div>
          <div className="text-2xl font-semibold text-gray-900 mt-1">
            {stats.categoriesCount}
          </div>
          <div className="text-xs text-gray-400 mt-1">Topic domains</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 flex gap-6">
        <button
          onClick={() => setActiveTab('questions')}
          className={`pb-3 text-sm font-medium border-b-2 transition ${
            activeTab === 'questions'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          Question Bank ({questions.length})
        </button>
        <button
          onClick={() => setActiveTab('results')}
          className={`pb-3 text-sm font-medium border-b-2 transition ${
            activeTab === 'results'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          Test Results ({attempts.length})
        </button>
      </div>

      {/* Alerts */}
      {message && (
        <div className="p-3 text-sm text-green-800 bg-green-50 border border-green-200 rounded-md flex items-center justify-between">
          <span>{message}</span>
          <button onClick={() => setMessage('')} className="text-green-700 text-xs">
            Dismiss
          </button>
        </div>
      )}
      {error && (
        <div className="p-3 text-sm text-red-800 bg-red-50 border border-red-200 rounded-md flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError('')} className="text-red-700 text-xs">
            Dismiss
          </button>
        </div>
      )}

      {/* TAB 1: QUESTION BANK */}
      {activeTab === 'questions' && (
        <div className="space-y-6">
          {/* Collapsible Add Question Form */}
          {showAddForm && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h2 className="text-base font-semibold text-gray-900 mb-1">
                Add New Question
              </h2>
              <p className="text-xs text-gray-500 mb-4">
                Enter question text, four options, and mark the correct choice.
              </p>

              <form onSubmit={handleAddQuestion} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Question Text
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-600"
                    placeholder="Enter question text..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {options.map((opt, idx) => (
                    <div key={idx}>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Option {idx + 1}{' '}
                        {correctAnswer === idx && (
                          <span className="text-green-600 font-semibold">(Correct)</span>
                        )}
                      </label>
                      <input
                        type="text"
                        required
                        value={opt}
                        onChange={(e) => handleOptionChange(idx, e.target.value)}
                        className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none ${
                          correctAnswer === idx
                            ? 'border-green-400 bg-green-50/40 focus:border-green-600'
                            : 'border-gray-300 focus:border-blue-600'
                        }`}
                        placeholder={`Option ${idx + 1}`}
                      />
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Correct Answer
                    </label>
                    <select
                      value={correctAnswer}
                      onChange={(e) => setCorrectAnswer(Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-600"
                    >
                      <option value={0}>Option 1</option>
                      <option value={1}>Option 2</option>
                      <option value={2}>Option 3</option>
                      <option value={3}>Option 4</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-600"
                      placeholder="e.g. Algorithms, Databases"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium px-4 py-2 rounded-md transition"
                  >
                    {saving ? 'Saving...' : 'Save Question'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="text-sm text-gray-600 hover:text-gray-900 border border-gray-300 px-4 py-2 rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Search, Filter & Question List */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-sm font-medium text-gray-900">
                All Questions ({filteredQuestions.length})
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1.5 text-xs w-48 sm:w-64 focus:outline-none focus:border-blue-600"
                />

                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1.5 text-xs bg-white focus:outline-none focus:border-blue-600"
                >
                  <option value="All">All Categories</option>
                  {stats.categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {filteredQuestions.length === 0 ? (
              <div className="p-8 text-center text-sm text-gray-500">
                No questions found matching your filter.
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredQuestions.map((q, idx) => (
                  <div
                    key={q._id}
                    className="p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:bg-gray-50 transition"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 font-medium">
                          #{idx + 1}
                        </span>
                        <span className="text-xs font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-200">
                          {q.category}
                        </span>
                      </div>

                      <p className="text-sm font-medium text-gray-900">
                        {q.questionText}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1 max-w-xl">
                        {q.options.map((opt, oIdx) => (
                          <div
                            key={oIdx}
                            className={`px-3 py-1.5 rounded border flex items-center justify-between ${
                              oIdx === q.correctAnswer
                                ? 'bg-green-50 border-green-300 text-green-900 font-medium'
                                : 'bg-white border-gray-200 text-gray-700'
                            }`}
                          >
                            <span>
                              <span className="text-gray-400 mr-2">
                                {String.fromCharCode(65 + oIdx)}.
                              </span>
                              {opt}
                            </span>
                            {oIdx === q.correctAnswer && (
                              <span className="text-green-700 text-[11px] font-semibold">
                                Correct
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => setDeletingQuestion(q)}
                      className="self-end sm:self-start text-xs font-medium text-red-600 hover:text-red-800 border border-red-200 rounded px-2.5 py-1 hover:bg-red-50 transition"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: TEST RESULTS */}
      {activeTab === 'results' && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-900">
              Student Submissions
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Review completed test submissions and scores across all candidates.
            </p>
          </div>

          {attempts.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-500">
              No test submissions recorded yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 text-xs font-medium">
                  <tr>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Score</th>
                    <th className="py-3 px-4">Percentage</th>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm">
                  {attempts.map((att) => {
                    const pct = Math.round(
                      (att.score / att.totalQuestions) * 100
                    );
                    return (
                      <tr key={att._id} className="hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-900">
                            {att.userId?.name || 'Anonymous Student'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {att.userId?.email || 'N/A'}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-medium text-gray-900">
                          {att.score} / {att.totalQuestions}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-xs font-medium border ${
                              pct >= 70
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : pct >= 40
                                ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                : 'bg-red-50 text-red-700 border-red-200'
                            }`}
                          >
                            {pct}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600 text-xs">
                          {formatDate(att.submittedAt)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Link
                            to={`/result/${att._id}`}
                            className="text-xs text-blue-600 hover:underline font-medium"
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
      )}

      {/* Delete Confirmation Modal */}
      {deletingQuestion && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-lg border border-gray-200 space-y-4">
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                Delete Question
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Are you sure you want to remove this question from the database? This action cannot be undone.
              </p>
            </div>

            <div className="p-3 bg-gray-50 rounded border border-gray-200 text-xs text-gray-700">
              "{deletingQuestion.questionText}"
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingQuestion(null)}
                className="text-xs font-medium text-gray-700 border border-gray-300 rounded px-3 py-1.5 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded px-3 py-1.5 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
