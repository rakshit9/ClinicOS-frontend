import React, { useState, Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import { ErrorBoundary } from './components/error-boundary';
import { AuthProvider } from './contexts/AuthContext';

// Timeout wrapper for lazy imports
const withTimeout = (importFunc: () => Promise<any>, timeout = 15000) => {
  return () => Promise.race([
    importFunc(),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Import timeout')), timeout)
    )
  ]);
};

// Lazy load heavy components with timeout protection
const AILandingPage = lazy(() => 
  withTimeout(
    () => import('./components/ai-landing-page').then(module => ({ default: module.AILandingPage }))
  )().catch(() => ({ default: () => <div className="p-8 text-center">Error loading landing page</div> }))
);

const DashboardApp = lazy(() => 
  withTimeout(
    () => import('./components/dashboard-app').then(module => ({ default: module.DashboardApp }))
  )().catch(() => ({ default: () => <div className="p-8 text-center">Error loading dashboard</div> }))
);

const PremiumAuthFlow = lazy(() => 
  withTimeout(
    () => import('./components/premium-auth-flow').then(module => ({ default: module.PremiumAuthFlow }))
  )().catch(() => ({ default: () => <div className="p-8 text-center">Error loading auth</div> }))
);

// Main App Router Component
function AppRouter() {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  // Add loading state management
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <ErrorBoundary>
      <Suspense fallback={
        <div className="min-h-screen bg-canvas flex items-center justify-center">
          <div className="text-center space-y-4 max-w-md mx-auto p-6">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-subtext">Loading ClinicPilot...</p>
            <p className="text-xs text-subtext/60">
              {isLoading ? 'Initializing...' : 'This may take a moment on first load'}
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="text-xs text-primary hover:text-primary-hover underline mt-4"
            >
              Refresh if loading takes too long
            </button>
          </div>
        </div>
      }>
        <Routes>
          <Route path="/" element={<AILandingPage />} />
          <Route path="/auth" element={<PremiumAuthFlow />} />
          <Route path="/dashboard/*" element={<DashboardApp />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRouter />
        <Toaster />
      </AuthProvider>
    </Router>
  );
}