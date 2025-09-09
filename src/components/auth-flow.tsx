import React, { useState } from 'react';
import { SignInScreen, AuthScreen } from './auth/sign-in-screen';
import { SignUpScreen } from './auth/sign-up-screen';
import { ForgotPasswordScreen, ResetPasswordScreen } from './auth/forgot-reset-screen';

interface AuthFlowProps {
  onComplete: () => void;
  onBack: () => void;
}

export { AuthScreen };

export function AuthFlow({ onComplete, onBack }: AuthFlowProps) {
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
        <SignInScreen
          onSuccess={handleAuthSuccess}
          onNavigate={handleNavigate}
        />
      );
    case 'signup':
      return (
        <SignUpScreen
          onSuccess={handleAuthSuccess}
          onNavigate={handleNavigate}
        />
      );
    case 'forgot':
      return (
        <ForgotPasswordScreen
          onNavigate={handleNavigate}
        />
      );
    case 'reset':
      return (
        <ResetPasswordScreen
          onNavigate={handleNavigate}
        />
      );
    default:
      return (
        <SignInScreen
          onSuccess={handleAuthSuccess}
          onNavigate={handleNavigate}
        />
      );
  }
}