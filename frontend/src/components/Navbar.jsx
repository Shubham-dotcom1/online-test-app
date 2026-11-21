import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const linkClass = (path) =>
    `text-sm font-medium px-3 py-1.5 rounded-md transition ${
      location.pathname === path
        ? 'bg-blue-50 text-blue-700 font-semibold'
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
    }`;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand Logo with 4-Option Icon */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2.5 group">
            {/* ABCD 4-Square Assessment Icon matching reference */}
            <div className="w-9 h-9 rounded-lg bg-blue-50 border-2 border-blue-600 p-1 grid grid-cols-2 gap-0.5 shadow-sm">
              <div className="bg-white rounded-[2px] flex items-center justify-center text-[9px] font-bold text-blue-700">
                A
              </div>
              <div className="bg-emerald-500 rounded-[2px] flex items-center justify-center text-[9px] font-bold text-white">
                ✓
              </div>
              <div className="bg-white rounded-[2px] flex items-center justify-center text-[9px] font-bold text-blue-700">
                C
              </div>
              <div className="bg-white rounded-[2px] flex items-center justify-center text-[9px] font-bold text-blue-700">
                D
              </div>
            </div>

            <div className="flex flex-col">
              <span className="font-extrabold text-gray-900 text-lg tracking-tight leading-none">
                Online <span className="text-blue-600">Test</span>
              </span>
              <span className="text-[10px] text-gray-500 font-medium tracking-wide">
                Assessment Portal
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link to="/" className={linkClass('/')}>
              Dashboard
            </Link>
            {user ? (
              <>
                <Link to="/history" className={linkClass('/history')}>
                  Test History
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className={linkClass('/admin')}>
                    Admin Portal
                  </Link>
                )}
              </>
            ) : (
              <a
                href="/#assessments"
                className="text-sm font-medium px-3 py-1.5 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition"
              >
                Mock Tests
              </a>
            )}
          </nav>
        </div>

        {/* Right User Actions (Sign in / Sign up vs User Profile) */}
        <div>
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-sm bg-gray-50 border border-gray-200 rounded-full px-3 py-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="font-semibold text-gray-800">{user.name}</span>
                <span className="text-[10px] uppercase bg-blue-100 text-blue-700 font-extrabold px-1.5 py-0.5 rounded">
                  {user.role}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="text-sm font-semibold text-gray-700 border border-gray-300 rounded-full px-4 py-1.5 hover:bg-gray-100 hover:text-gray-900 transition"
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                to="/login"
                className="text-sm font-bold text-gray-700 hover:text-blue-600 border border-gray-300 hover:border-blue-600 rounded-full px-4 py-1.5 transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-full px-4 py-1.5 shadow-sm transition"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
