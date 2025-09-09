import React, { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { AuthLayout } from './auth-layout';
import { AuthInput } from './auth-input';
import { AuthButton } from './auth-button';
import { AuthCheckbox } from './auth-checkbox';
import { AuthDivider } from './auth-divider';
import { GoogleIcon } from './google-icon';
import { InfoCapsule } from './info-capsule';
import { toast } from 'sonner@2.0.3';

export type AuthScreen = 'signin' | 'signup' | 'forgot' | 'reset';

interface SignInScreenProps {
  onSuccess: () => void;
  onNavigate: (screen: AuthScreen) => void;
}

export function SignInScreen({ onSuccess, onNavigate }: SignInScreenProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = formData.email && validateEmail(formData.email) && formData.password;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsLoading(false);
    toast.success('Welcome back!');
    onSuccess();
  };

  const handleGoogleSignIn = () => {
    toast.success('Google Sign In - Feature coming soon');
  };

  const handleDemoCredentials = () => {
    setFormData({
      ...formData,
      email: 'demo@clinicpilot.com',
      password: 'demo1234'
    });
    setErrors({});
  };

  return (
    <AuthLayout variant="signin">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-medium text-text">Welcome back</h1>
          <p className="text-subtext">Sign in to your ClinicPilot account</p>
        </div>

        {/* Demo Info */}
        <InfoCapsule title="Demo Credentials">
          <div className="space-y-1">
            <div className="text-xs">
              <strong>Email:</strong> demo@clinicpilot.com
            </div>
            <div className="text-xs">
              <strong>Password:</strong> demo1234
            </div>
            <button
              type="button"
              onClick={handleDemoCredentials}
              className="text-xs text-primary hover:text-primary-hover underline mt-2"
            >
              Use these credentials
            </button>
          </div>
        </InfoCapsule>

        {/* Form */}
        <form onSubmit={handleSignIn} className="space-y-5">
          <AuthInput
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
            icon={<Mail size={18} />}
          />

          <AuthInput
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            error={errors.password}
            icon={<Lock size={18} />}
            showPasswordToggle
          />

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <AuthCheckbox
              checked={formData.rememberMe}
              onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
              label="Remember me"
            />
            <button
              type="button"
              onClick={() => onNavigate('forgot')}
              className="text-sm text-primary hover:text-primary-hover underline"
            >
              Forgot password?
            </button>
          </div>

          {/* Sign In Button */}
          <AuthButton
            type="submit"
            variant="primary"
            loading={isLoading}
            disabled={!isFormValid}
            className="w-full"
          >
            Sign in
          </AuthButton>
        </form>

        {/* Divider */}
        <AuthDivider />

        {/* Google Sign In */}
        <AuthButton
          variant="google"
          onClick={handleGoogleSignIn}
          className="w-full"
        >
          <GoogleIcon />
          Continue with Google
        </AuthButton>

        {/* Footer */}
        <div className="text-center">
          <span className="text-subtext text-sm">New here? </span>
          <button
            onClick={() => onNavigate('signup')}
            className="text-sm text-primary hover:text-primary-hover font-medium underline"
          >
            Create an account
          </button>
        </div>
      </div>
    </AuthLayout>
  );
}