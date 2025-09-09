import React, { useState } from 'react';
import { AILandingPage } from './components/ai-landing-page';
import { DashboardApp } from './components/dashboard-app';
import { PremiumAuthFlow } from './components/premium-auth-flow';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'landing' | 'auth' | 'dashboard'>('landing');

  const handleTryDemo = () => {
    setCurrentScreen('dashboard');
  };

  const handleShowSignIn = () => {
    setCurrentScreen('auth');
  };

  const handleAuthComplete = () => {
    setCurrentScreen('dashboard');
  };

  const handleAuthBack = () => {
    setCurrentScreen('landing');
  };

  const handleCloseDashboard = () => {
    setCurrentScreen('landing');
  };

  return (
    <>
      {currentScreen === 'landing' && (
        <AILandingPage 
          onTryDemo={handleTryDemo} 
          onSignIn={handleShowSignIn}
        />
      )}
      {currentScreen === 'auth' && (
        <PremiumAuthFlow 
          onComplete={handleAuthComplete}
          onBack={handleAuthBack}
        />
      )}
      {currentScreen === 'dashboard' && (
        <DashboardApp onClose={handleCloseDashboard} />
      )}
      <Toaster />
    </>
  );
}