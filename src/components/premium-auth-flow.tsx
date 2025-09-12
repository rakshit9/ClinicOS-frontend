import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PremiumSignIn } from './auth/premium-sign-in';
import { PremiumSignUp } from './auth/premium-sign-up';
import { PremiumForgotPassword, PremiumResetPassword } from './auth/premium-forgot-reset';

export type AuthScreen = 'signin' | 'signup' | 'forgot' | 'reset';

interface PremiumAuthFlowProps {
  onComplete?: () => void;
  onBack?: () => void;
}

export function PremiumAuthFlow({ onComplete, onBack }: PremiumAuthFlowProps) {
  const navigate = useNavigate();
  const [currentScreen, setCurrentScreen] = useState<AuthScreen>('signin');

  const handleAuthSuccess = () => {
    if (onComplete) {
      onComplete();
    } else {
      navigate('/dashboard');
    }
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