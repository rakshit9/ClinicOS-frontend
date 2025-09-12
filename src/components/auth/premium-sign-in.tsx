import React, { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { AuroraLayout } from './aurora-layout';
import { TextField } from './text-field';
import { AuroraButton } from './aurora-button';
import { PremiumSwitch } from './premium-switch';
import { PremiumDivider } from './premium-divider';
import { GoogleIcon } from './google-icon';
import { PremiumInfoCapsule } from './premium-info-capsule';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';

import { AuthScreen } from '../premium-auth-flow';

interface PremiumSignInProps {
  onSuccess: () => void;
  onNavigate: (screen: AuthScreen) => void;
}

export function PremiumSignIn({ onSuccess, onNavigate }: PremiumSignInProps) {
  const { login } = useAuth();
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

    try {
      await login({
        email: formData.email,
        password: formData.password
      });
      
      toast.success('Welcome back!');
      onSuccess();
    } catch (error: any) {
      console.error('Login failed:', error);
      toast.error(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
    <AuroraLayout variant="signin">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-medium text-text">Welcome back</h1>
          <p className="text-subtext">Sign in to your ClinicPilot account</p>
        </div>

        {/* Demo Info */}
        <PremiumInfoCapsule title="Demo Credentials">
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
        </PremiumInfoCapsule>

        {/* Form */}
        <form onSubmit={handleSignIn} className="space-y-6">
          <TextField
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
            icon={<Mail size={20} />}
          />

          <TextField
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            error={errors.password}
            icon={<Lock size={20} />}
            showPasswordToggle
          />

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <PremiumSwitch
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
          <AuroraButton
            type="submit"
            variant="primary"
            loading={isLoading}
            disabled={!isFormValid}
            className="w-full"
          >
            Sign in
          </AuroraButton>
        </form>

        {/* Divider */}
        <PremiumDivider />

        {/* Google Sign In */}
        <AuroraButton
          variant="google"
          onClick={handleGoogleSignIn}
          className="w-full"
        >
          <GoogleIcon />
          Continue with Google
        </AuroraButton>

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
    </AuroraLayout>
  );
}