import React, { useState } from 'react';
import { PremiumSignIn, type AuthScreen } from './auth/premium-sign-in';
import { PremiumSignUp } from './auth/premium-sign-up';
import { PremiumForgotPassword, PremiumResetPassword } from './auth/premium-forgot-reset';

interface PremiumAuthFlowProps {
  onComplete: () => void;
  onBack: () => void;
}

export type { AuthScreen };

export function PremiumAuthFlow({ onComplete, onBack }: PremiumAuthFlowProps) {
  const [currentScreen, setCurrentScreen] = useState<AuthScreen>('signin');

  const handleAuthSuccess = () => {
    onComplete();
  };

  const handleNavigate = (screen: AuthScreen) => {
    setCurrentScreen(screen);
  };

  switch (currentScreen) {
    case 'signin':
      return (
        <PremiumSignIn
          onSuccess={handleAuthSuccess}
          onNavigate={handleNavigate}
        />
      );
    case 'signup':
      return (
        <PremiumSignUp
          onSuccess={handleAuthSuccess}
          onNavigate={handleNavigate}
        />
      );
    case 'forgot':
      return (
        <PremiumForgotPassword
          onNavigate={handleNavigate}
        />
      );
    case 'reset':
      return (
        <PremiumResetPassword
          onNavigate={handleNavigate}
        />
      );
    default:
      return (
        <PremiumSignIn
          onSuccess={handleAuthSuccess}
          onNavigate={handleNavigate}
        />
      );
  }
}