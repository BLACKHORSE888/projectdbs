import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/layout/CartDrawer';
import { ToastContainer } from './components/common/ToastContainer';
import { WhatsAppButton } from './components/common/WhatsAppButton';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { AdminRoute } from './components/common/AdminRoute';

import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrdersPage } from './pages/OrdersPage';
import { ProfilePage } from './pages/ProfilePage';
import { TrialRequestPage } from './pages/TrialRequestPage';
import { SurveyPage } from './pages/SurveyPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { LoginPage } from './pages/LoginPage';
import { PoliciesPage } from './pages/PoliciesPage';
import { NotFoundPage } from './pages/NotFoundPage';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <ScrollToTop />
              <div className="min-h-screen flex flex-col bg-millet-100 text-charcoal-900">
                <Navbar />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/shop" element={<ShopPage />} />
                    <Route path="/product/:id" element={<ProductDetailPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/survey" element={<SurveyPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/policies" element={<PoliciesPage />} />

                    <Route
                      path="/checkout"
                      element={
                        <ProtectedRoute>
                          <CheckoutPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/orders"
                      element={
                        <ProtectedRoute>
                          <OrdersPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <ProfilePage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/trial"
                      element={
                        <ProtectedRoute>
                          <TrialRequestPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin"
                      element={
                        <AdminRoute>
                          <AdminDashboardPage />
                        </AdminRoute>
                      }
                    />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </main>
                <Footer />
                <CartDrawer />
                <ToastContainer />
                <WhatsAppButton />
              </div>
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
