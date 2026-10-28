import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import ErrorBoundary from './ErrorBoundary';
import { CartProvider } from './cart/CartContext';
import { AuthProvider } from './auth/AuthContext';
import RequireAuth from './auth/RequireAuth';
import RouteSkeleton from './components/RouteSkeleton';

// Immediate standard routes
import Home from './components/Home';
import Menu from './menu/Menu';
import DishDetail from './menu/DishDetail';
import CartPage from './cart/CartPage';
import LoginPage from './auth/LoginPage';
import NotFound from './components/NotFound';

// Lazy-loaded routes (Day 34 requirement: Code splitting & Suspense)
const Checkout = lazy(() => import('./checkout/Checkout'));
const Receipt = lazy(() => import('./orders/Receipt'));

export function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              {/* Nested layout route */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="menu" element={<Menu />} />
                <Route path="menu/:id" element={<DishDetail />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="login" element={<LoginPage />} />

                {/* Guarded lazy checkout route */}
                <Route
                  path="checkout"
                  element={
                    <RequireAuth>
                      <Suspense fallback={<RouteSkeleton title="Loading Secure Checkout..." />}>
                        <Checkout />
                      </Suspense>
                    </RequireAuth>
                  }
                />

                {/* Lazy confirmation receipt route */}
                <Route
                  path="receipt"
                  element={
                    <Suspense fallback={<RouteSkeleton title="Loading Order Receipt..." />}>
                      <Receipt />
                    </Suspense>
                  }
                />

                {/* Catch-all 404 route */}
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
