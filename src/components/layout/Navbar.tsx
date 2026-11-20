import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  Package,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { useToast } from '../../hooks/useToast';

const NAV_LINKS = [
  { to: '/shop', label: 'Shop' },
  { to: '/trial', label: 'Free Trial' },
  { to: '/survey', label: 'Survey' },
  { to: '/about', label: 'Our Story' },
  { to: '/contact', label: 'Contact' },
];

export const Navbar: React.FC = () => {
  const { user, userProfile, isAdmin, signInWithGoogle, logout } = useAuth();
  const { itemCount, openCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      showToast('Signed in with Google!');
      setMobileOpen(false);
    } catch (err) {
      console.error('Google Sign-In error:', err);
      const message =
        err instanceof Error ? err.message : 'Google Sign-In failed or was cancelled.';
      showToast(message, 'error');
    }
  };

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    setMobileOpen(false);
    showToast('Logged out successfully', 'info');
    navigate('/');
  };

  const displayName = userProfile?.name || user?.displayName || 'Account';
  const avatarUrl = userProfile?.photoURL || user?.photoURL;

  return (
    <header className="sticky top-0 z-40 bg-millet-100/95 backdrop-blur-md border-b border-millet-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark */}
        <Link
          to="/"
          className="text-xl font-extrabold tracking-tight text-forest-600 whitespace-nowrap shrink-0"
        >
          Milletly
        </Link>

        {/* Zone 2: Clean typography navigation */}
        <nav className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-sm font-medium whitespace-nowrap shrink-0 transition-colors hover:underline underline-offset-4 ${
                  isActive ? 'text-forest-600 font-semibold underline' : 'text-charcoal-700 hover:text-forest-600'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `text-sm font-semibold whitespace-nowrap shrink-0 transition-colors hover:underline underline-offset-4 ${
                  isActive ? 'text-saffron-600 underline' : 'text-saffron-600 hover:text-saffron-500'
                }`
              }
            >
              Admin
            </NavLink>
          )}
        </nav>

        {/* Zone 3: Cart & Auth Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={openCart}
            aria-label="Open shopping bag"
            className="relative p-2.5 rounded-xl bg-white border border-millet-200 hover:border-forest-500 text-charcoal-900 transition cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-saffron-500 text-white text-[11px] font-bold flex items-center justify-center tabular-nums">
                {itemCount}
              </span>
            )}
          </button>

          {!user ? (
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-forest-500 hover:bg-forest-600 text-white text-sm font-semibold transition whitespace-nowrap shrink-0 cursor-pointer"
            >
              <svg className="w-4 h-4 bg-white rounded-full p-0.5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
                />
              </svg>
              <span>Sign in</span>
            </button>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen((o) => !o)}
                className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-xl bg-white border border-millet-200 hover:border-forest-500 transition cursor-pointer"
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 rounded-lg object-cover shrink-0"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-forest-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="hidden sm:inline text-sm font-semibold text-charcoal-900 max-w-[110px] truncate">
                  {displayName.split(' ')[0]}
                </span>
                <ChevronDown className="w-4 h-4 text-charcoal-600 shrink-0" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-lg border border-millet-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-millet-100">
                    <p className="text-sm font-bold text-charcoal-900 truncate">{displayName}</p>
                    <p className="text-xs text-charcoal-600 truncate">{user.email}</p>
                  </div>

                  <Link
                    to="/orders"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-charcoal-800 hover:bg-millet-50 transition"
                  >
                    <Package className="w-4 h-4 text-forest-500" />
                    My Orders
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-charcoal-800 hover:bg-millet-50 transition"
                  >
                    <UserIcon className="w-4 h-4 text-forest-500" />
                    My Profile
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-saffron-600 hover:bg-saffron-50 transition"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Admin Dashboard
                    </Link>
                  )}

                  <div className="border-t border-millet-100 mt-1 pt-1">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="md:hidden p-2.5 rounded-xl bg-white border border-millet-200 text-charcoal-900 cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-millet-200 px-4 py-4 space-y-1.5">
          {NAV_LINKS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-xl text-sm font-semibold ${
                  isActive ? 'bg-forest-50 text-forest-600' : 'text-charcoal-800 hover:bg-millet-50'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          {isAdmin && (
            <NavLink
              to="/admin"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-sm font-semibold bg-saffron-50 text-saffron-600"
            >
              Admin Dashboard
            </NavLink>
          )}
          {!user && (
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full mt-2 px-4 py-3 rounded-xl bg-forest-500 text-white text-sm font-semibold cursor-pointer"
            >
              Sign in with Google
            </button>
          )}
        </div>
      )}
    </header>
  );
};
