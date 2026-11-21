import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login(email.trim(), password);
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      const targetUrl = (err.config?.baseURL || '') + (err.config?.url || '');
      if (!err.response) {
        setError(
          `Cannot connect to backend server at [${targetUrl || 'unknown URL'}]. Cause: ${err.message || 'Network Error'}. Please check if your Render backend is Live.`
        );
      } else {
        setError(
          err.response.data?.message || 'Invalid email or password. Please try again.'
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gray-50">
      <div className="w-full max-w-sm mb-3">
        <Link
          to="/"
          className="text-xs font-semibold text-gray-500 hover:text-blue-600 inline-flex items-center gap-1 transition"
        >
          ← Back to Home
        </Link>
      </div>

      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-xl p-7 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Sign in
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Enter your credentials to access your assessment portal.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 leading-relaxed break-all">
            <span className="text-red-500 font-bold shrink-0">✕</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
          <input type="text" name="fake_user" style={{ display: 'none' }} tabIndex="-1" />
          <input type="password" name="fake_pass" style={{ display: 'none' }} tabIndex="-1" />

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              name="portal_login_email"
              required
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] font-semibold text-blue-600 hover:text-blue-800"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              name="portal_login_password"
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition font-mono"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] disabled:bg-blue-400 text-white text-sm font-bold py-2.5 rounded-lg shadow-sm transition"
          >
            {submitting ? 'Authenticating...' : 'Sign in to Account'}
          </button>
        </form>

        <p className="mt-6 text-xs text-center text-gray-600 pt-5 border-t border-gray-100">
          Don't have an account yet?{' '}
          <Link
            to="/register"
            className="text-blue-600 hover:underline font-bold"
          >
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}
