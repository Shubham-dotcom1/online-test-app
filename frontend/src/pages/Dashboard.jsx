import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import HeroIllustration from '../components/HeroIllustration';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recentAttempts, setRecentAttempts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All',
    'Algorithms',
    'Data Structures',
    'Web Development',
    'Databases',
    'JavaScript',
    'React',
    'Networking',
  ];

  useEffect(() => {
    if (user) {
      api
        .get('/test/history')
        .then((res) => setRecentAttempts(res.data.attempts.slice(0, 4)))
        .catch(() => {});
    }
  }, [user]);

  const handleStartTest = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate('/test');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ======================================================== */}
      {/* HERO SECTION (Modeled after reference image - No Glassmorphism) */}
      {/* ======================================================== */}
      <section className="bg-white border-b border-gray-200 pt-10 pb-14 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Heading, Subtitle, CTAs, Stats */}
          <div className="lg:col-span-7 space-y-6">
            {/* Tagline / Eyebrow */}
            <div className="inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span className="text-xs sm:text-sm font-extrabold tracking-wider uppercase text-amber-600">
                Free Online Mock Tests & Practice Papers
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl font-black text-gray-900 leading-tight tracking-tight">
              Master Your{' '}
              <span className="text-amber-500 underline decoration-amber-300 decoration-wavy decoration-2">
                Competitive Exams
              </span>
            </h1>

            {/* Description Paragraph */}
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-xl">
              Practice free online test series in Computer Science, Algorithms,
              Data Structures, Web Development, and Databases — built for
              Software Engineering, Campus Placements, Gate, and Technical Interview
              aspirants.
            </p>

            {/* CTA Buttons (Pill shaped, high-contrast, no glassmorphism) */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={handleStartTest}
                className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold text-base px-8 py-3.5 rounded-full shadow-md hover:shadow-lg transition flex items-center gap-2"
              >
                <span>Start a Free Test</span>
                <span className="text-lg">➔</span>
              </button>

              <a
                href="#assessments"
                className="bg-white border-2 border-gray-900 hover:bg-gray-100 text-gray-900 font-bold text-base px-7 py-3 rounded-full transition"
              >
                Browse Categories
              </a>

              {!user && (
                <Link
                  to="/login"
                  className="text-sm font-bold text-blue-600 hover:underline px-2 py-2"
                >
                  Already have an account? Sign in ➔
                </Link>
              )}
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-100 max-w-md">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                  10+
                </div>
                <div className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
                  Core Topics
                </div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                  10 Mins
                </div>
                <div className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
                  Timed Tests
                </div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                  100%
                </div>
                <div className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
                  Instant Grading
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Graphic / Mock Screen Illustration */}
          <div className="lg:col-span-5 flex justify-center">
            <HeroIllustration />
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* MAIN CONTENT AREA */}
      {/* ======================================================== */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 w-full space-y-10 flex-1" id="assessments">
        {/* Category Filter Pills */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              Explore Practice Domains
            </h2>
            <span className="text-xs text-gray-500">
              Filter available mock test categories
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition border ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Primary Assessment Box */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100">
            <div>
              <div className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full mb-2">
                Active Assessment · {selectedCategory}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                Computer Science & Engineering Mock Test
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Standard technical assessment consisting of randomized multiple-choice questions.
              </p>
            </div>

            <button
              onClick={handleStartTest}
              className="self-start md:self-auto bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold px-6 py-3 rounded-xl shadow transition"
            >
              Start Assessment ➔
            </button>
          </div>

          {/* Test Specs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6 text-sm">
            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-lg">
                📝
              </div>
              <div>
                <div className="text-xs text-gray-500 font-medium">Questions</div>
                <div className="font-bold text-gray-900 text-base">10 MCQs</div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 font-bold flex items-center justify-center text-lg">
                ⏱️
              </div>
              <div>
                <div className="text-xs text-gray-500 font-medium">Time Limit</div>
                <div className="font-bold text-gray-900 text-base">10 Minutes</div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-lg">
                🎯
              </div>
              <div>
                <div className="text-xs text-gray-500 font-medium">Evaluation</div>
                <div className="font-bold text-gray-900 text-base">+1 Correct / 0 Wrong</div>
              </div>
            </div>
          </div>

          {/* Instructions List */}
          <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5 text-sm text-gray-700 space-y-2">
            <div className="font-semibold text-gray-900 text-sm mb-1 flex items-center gap-2">
              <span>📋</span> Assessment Guidelines:
            </div>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-gray-600">
              <li>Each question has exactly four options with one verified answer.</li>
              <li>You can navigate freely using the question palette and change answers anytime before submission.</li>
              <li>The test will automatically submit when the 10-minute timer reaches 00:00.</li>
              <li>Instant scorecard with complete question-by-question explanations is generated on submit.</li>
            </ul>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xl mb-3">
              ⏱
            </div>
            <h4 className="font-bold text-gray-900 text-base">
              Strict Timed Environment
            </h4>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Auto-sync countdown timer accurately simulates realistic placement tests and competitive exams.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl mb-3">
              🛡
            </div>
            <h4 className="font-bold text-gray-900 text-base">
              Server-Side Evaluation
            </h4>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Correct answers stay secure on the server until submission, preventing any client-side tampering.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center text-xl mb-3">
              📊
            </div>
            <h4 className="font-bold text-gray-900 text-base">
              Performance Review
            </h4>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Revisit past attempts, review mistake breakdowns, and track your conceptual growth over time.
            </p>
          </div>
        </div>

        {/* Recent Attempts Section (Visible if user has logged in and taken attempts) */}
        {recentAttempts.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <h3 className="text-base sm:text-lg font-bold text-gray-900">
                Your Recent Attempts
              </h3>
              <Link
                to="/history"
                className="text-sm text-blue-600 hover:text-blue-800 font-semibold"
              >
                View full history ➔
              </Link>
            </div>

            <div className="divide-y divide-gray-100">
              {recentAttempts.map((item, idx) => {
                const percentage = Math.round(
                  (item.score / item.totalQuestions) * 100
                );
                return (
                  <div
                    key={item._id}
                    className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm hover:bg-gray-50/50 px-2 rounded-lg transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                        #{recentAttempts.length - idx}
                      </span>
                      <div>
                        <div className="font-bold text-gray-900">
                          Score: {item.score} / {item.totalQuestions}{' '}
                          <span
                            className={`ml-2 text-xs font-semibold px-2 py-0.5 rounded ${
                              percentage >= 70
                                ? 'bg-emerald-100 text-emerald-800'
                                : percentage >= 40
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {percentage}%
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          Submitted on {new Date(item.submittedAt).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <Link
                      to={`/result/${item._id}`}
                      className="self-end sm:self-auto text-sm font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3.5 py-1.5 rounded-lg transition"
                    >
                      Review Breakdown
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 text-center text-xs text-gray-500">
        Online Test Portal · Computer Science & Technical Skills Assessment Platform
      </footer>
    </div>
  );
}
