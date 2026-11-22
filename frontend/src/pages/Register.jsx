import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await register(name.trim(), email.trim(), password);
      navigate('/');
    } catch (err) {
      console.error('Registration error:', err);
      const targetUrl = (err.config?.baseURL || '') + (err.config?.url || '');
      if (!err.response) {
        setError(
          `Cannot connect to backend server at [${targetUrl || 'unknown URL'}]. Cause: ${err.message || 'Network Error'}. Please check if your Render backend is Live.`
        );
      } else if (err.response.status === 404) {
        setError(
          `Backend returned 404 Not Found at [${targetUrl}]. The Render backend service is not running or deploying. Please verify your Render service is Live.`
        );
      } else if (err.response.status >= 500) {
        setError(
          `Backend error (${err.response.status}): ${err.response.data?.message || 'Server error. Please check Render backend logs.'}`
        );
      } else {
        setError(err.response.data?.message || 'Registration failed');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-gray-50">
      <div className="w-full max-w-sm mb-3">
        <Link
          to="/"
          className="text-xs font-semibold text-gray-500 hover:text-blue-600 inline-flex items-center gap-1 transition"
        >
          ← Back to Home
        </Link>
      </div>

      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-md p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-gray-900 mb-1">
          Create account
        </h1>
        <p className="text-sm text-gray-600 mb-5">
          Register as a student to take tests and track your scores.
        </p>

        {error && (
          <div className="mb-4 p-3 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded leading-relaxed break-all">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
          <input type="text" name="fake_user" style={{ display: 'none' }} tabIndex="-1" />
          <input type="password" name="fake_pass" style={{ display: 'none' }} tabIndex="-1" />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="reg_fullname"
              required
              autoComplete="off"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-600"
              placeholder="Jane Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="reg_email"
              required
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-600"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="reg_password"
              required
              minLength={6}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-600"
              placeholder="At least 6 characters"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium py-2 rounded transition"
          >
            {submitting ? 'Creating account...' : 'Sign up'}
          </button>
        </form>

        <p className="mt-5 text-sm text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
