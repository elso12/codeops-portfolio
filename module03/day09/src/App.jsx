import React, { lazy, Suspense, useState, useCallback, Profiler } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Header from './components/Header.jsx';
import Menu from './components/Menu.jsx';
import CartPanel from './components/CartPanel.jsx';
import ErrorBoundary from './ErrorBoundary.jsx';
import MenuUnavailable from './components/MenuUnavailable.jsx';
import CartUnavailable from './components/CartUnavailable.jsx';
import RouteSkeleton from './components/RouteSkeleton.jsx';
import ProfilerHud from './components/ProfilerHud.jsx';

import { recordCommit } from './telemetry.js';
import { useCart } from './cart/CartContext.jsx';

// Exercise 4: Code Splitting & Lazy-Loading screens behind dynamic imports
const Checkout = lazy(() => import('./checkout/Checkout.jsx'));
const Receipt = lazy(() => import('./orders/Receipt.jsx'));

function CartFallback({ error, onReset }) {
  const { resetCartCrash } = useCart();
  const handleReset = () => {
    resetCartCrash();
    if (onReset) onReset();
  };
  return <CartUnavailable error={error} onReset={handleReset} />;
}

/**
 * App - Root Application for Addis Eats Hardened Edition.
 *
 * Architecture & Seams (Day 34):
 * 1. Global last-resort ErrorBoundary around the entire app tree.
 * 2. Independent ErrorBoundary around the Menu catalog (<MenuUnavailable /> fallback).
 * 3. Independent ErrorBoundary around the Cart panel (<CartUnavailable /> fallback).
 * 4. Lazy route splitting behind <Suspense fallback={<RouteSkeleton />}>.
 * 5. Integrated React.Profiler tracking actual render timings (Exercise 5 & 6).
 */
export default function App() {
  // Fault Injection State for Exercise 2 (Menu/Dish deliberate failure)
  const [isDishCrashed, setIsDishCrashed] = useState(false);
  const crashedDishId = 3; // Kitfo (id: 3)

  // Performance benchmarking toggle for Exercise 5 & 6
  const [useMemoization, setUseMemoization] = useState(true);

  const handleProfilerRender = useCallback(
    (id, phase, actualDuration, baseDuration, startTime, commitTime) => {
      // Record telemetry outside React state so recording a commit never cascades into an App re-render
      recordCommit({
        id,
        phase,
        actualDuration,
        baseDuration,
        startTime,
        commitTime,
      });
    },
    []
  );

  const handleTriggerDishCrash = () => {
    setIsDishCrashed(true);
  };

  const handleResetDishCrash = () => {
    setIsDishCrashed(false);
  };

  return (
    <ErrorBoundary
      fallback={
        <div role="alert" className="critical-app-fallback">
          <h2>⚠️ Critical Application Failure</h2>
          <p>The root system crashed. Please reload.</p>
          <button
            type="button"
            className="btn-retry"
            onClick={() => window.location.reload()}
          >
            Reload Addis Eats
          </button>
        </div>
      }
    >
      <div className="app-layout">
        <Header
          onTriggerDishCrash={handleTriggerDishCrash}
          isDishCrashed={isDishCrashed}
          onResetDishCrash={handleResetDishCrash}
        />

        <main className="main-content">
          <Suspense fallback={<RouteSkeleton title="Loading view..." />}>
            <Routes>
              <Route
                path="/"
                element={
                  <Profiler id="AddisEats-CatalogView" onRender={handleProfilerRender}>
                    <div className="layout-grid">
                      {/* Exercise 1 & 2: ErrorBoundary wrapped around Menu.
                          Uses a stable key so it never force-remounts;
                          recovery flows through the boundary's own resetErrorBoundary
                          which is wired to handleResetDishCrash via onReset. */}
                      <ErrorBoundary
                        fallback={<MenuUnavailable onReset={handleResetDishCrash} />}
                        onReset={handleResetDishCrash}
                      >
                        <Menu
                          isDishCrashed={isDishCrashed}
                          crashedDishId={crashedDishId}
                          useMemoization={useMemoization}
                        />
                      </ErrorBoundary>

                      {/* Exercise 3: Independent ErrorBoundary around Cart.
                          Passes error + onReset so CartUnavailable can display
                          diagnostic details and offer a proper retry action. */}
                      <ErrorBoundary
                        fallback={({ error, onReset: resetCart }) => (
                          <CartFallback error={error} onReset={resetCart} />
                        )}
                      >
                        <CartPanel />
                      </ErrorBoundary>
                    </div>
                  </Profiler>
                }
              />
              {/* /menu is an alias — redirect to / so we don't duplicate JSX */}
              <Route path="/menu" element={<Navigate to="/" replace />} />

              {/* Exercise 4: Lazy-loaded routes */}
              <Route
                path="/checkout"
                element={
                  <ErrorBoundary fallback={<div className="route-error">Could not load Checkout. Check network connection.</div>}>
                    <Checkout />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/receipt"
                element={
                  <ErrorBoundary fallback={<div className="route-error">Could not load Receipt.</div>}>
                    <Receipt />
                  </ErrorBoundary>
                }
              />
            </Routes>
          </Suspense>
        </main>

        <footer className="app-footer">
          <div className="footer-container">
            <p className="footer-brand">
              Addis Eats • IBT College Canada CodeOps • Full Stack Software Development
            </p>
            <p className="footer-credits">
              Day 34: Error Boundaries, Performance Profiling & React Portals
            </p>
          </div>
        </footer>

        {/* Telemetry HUD for live profiling */}
        <ProfilerHud
          useMemoization={useMemoization}
          onToggleMemoization={() => setUseMemoization((prev) => !prev)}
        />
      </div>
    </ErrorBoundary>
  );
}
