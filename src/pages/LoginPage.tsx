import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sprout, ShieldCheck } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { usePageMeta } from '../hooks/usePageMeta';

export const LoginPage: React.FC = () => {
  usePageMeta({
    title: 'Sign in with Google',
    description:
      'Sign in to Milletly using your Google account to place orders and track deliveries.',
  });

  const { user, signInWithGoogle } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [submitting, setSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleLogin = async () => {
    setSubmitting(true);
    setAuthError(null);
    try {
      await signInWithGoogle();
      showToast('Welcome to Milletly!');
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Google Sign-In error:', err);
      const message =
        err instanceof Error ? err.message : 'Google Sign-In failed. Please try again.';
      setAuthError(message);
      showToast(message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-[2rem] p-8 sm:p-10 shadow-soft border border-millet-200 text-center">
        <div className="w-14 h-14 rounded-2xl bg-forest-500 text-millet-100 flex items-center justify-center mx-auto mb-5 shadow">
          <Sprout className="w-7 h-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 mb-2">
          Sign in to Milletly
        </h1>
        <p className="text-sm text-charcoal-600 mb-8">
          One-tap Google login to checkout, track orders, and request free trial snack packs.
        </p>

        <button
          type="button"
          onClick={handleLogin}
          disabled={submitting}
          className="w-full py-3.5 px-5 rounded-2xl bg-white hover:bg-millet-50 border-2 border-charcoal-900/15 hover:border-forest-500 text-charcoal-900 font-bold flex items-center justify-center gap-3 shadow-sm transition active:scale-[0.99] disabled:opacity-60 cursor-pointer"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
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
          <span>{submitting ? 'Signing in...' : 'Continue with Google'}</span>
        </button>

        {authError && (
          <div className="mt-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-left text-xs text-red-700 leading-relaxed">
            {authError}
          </div>
        )}

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-charcoal-600">
          <ShieldCheck className="w-4 h-4 text-forest-500" />
          <span>Secured by Firebase Google Authentication</span>
        </div>
      </div>
    </div>
  );
};
