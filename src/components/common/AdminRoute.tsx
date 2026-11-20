import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-forest-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-3xl p-8 shadow-soft border border-millet-200">
          <ShieldAlert className="w-12 h-12 text-saffron-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-charcoal-900 mb-2">Admin Access Required</h1>
          <p className="text-charcoal-600 mb-6 text-sm">
            Signed in as <span className="font-medium">{user.email}</span>. Only authorized
            Milletly admin emails configured in <code>VITE_ADMIN_EMAILS</code> can access this
            dashboard.
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-forest-500 text-white font-semibold hover:bg-forest-600 transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
