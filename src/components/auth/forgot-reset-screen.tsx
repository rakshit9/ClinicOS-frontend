import React, { useState } from 'react';
import { Mail, Lock, ArrowLeft, MailOpen, RefreshCw } from 'lucide-react';
import { AuthLayout } from './auth-layout';
import { AuthInput } from './auth-input';
import { AuthButton } from './auth-button';
import { PasswordStrength } from './password-strength';
import { OTPInput } from './otp-input';
import { toast } from 'sonner@2.0.3';
import { AuthScreen } from './sign-in-screen';

interface ForgotPasswordScreenProps {
  onNavigate: (screen: AuthScreen) => void;
}

interface ResetPasswordScreenProps {
  onNavigate: (screen: AuthScreen) => void;
}

// Forgot Password Screen
export function ForgotPasswordScreen({ onNavigate }: ForgotPasswordScreenProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isFormValid = email && validateEmail(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsLoading(false);
    setShowSuccess(true);
  };

  const handleResend = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    toast.success('Reset link sent again');
  };

  const handleOpenMail = () => {
    toast.success('Opening mail app...');
  };

  const maskEmail = (email: string) => {
    const [user, domain] = email.split('@');
    const maskedUser = user.charAt(0) + '*'.repeat(user.length - 2) + user.charAt(user.length - 1);
    return `${maskedUser}@${domain}`;
  };

  if (showSuccess) {
    return (
      <AuthLayout variant="forgot">
        <div className="text-center space-y-6">
          {/* Illustration */}
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <MailOpen className="w-8 h-8 text-primary" />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <h1 className="text-2xl font-medium text-text">Check your email</h1>
            <p className="text-subtext">
              We've sent a password reset link to{' '}
              <span className="font-medium text-text">{maskEmail(email)}</span>
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <AuthButton
              variant="ghost"
              onClick={handleOpenMail}
              className="w-full"
            >
              <MailOpen size={18} />
              Open mail app
            </AuthButton>

            <button
              onClick={handleResend}
              disabled={isLoading}
              className="w-full text-sm text-subtext hover:text-text transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <RefreshCw size={16} className="animate-spin" />
              ) : (
                <RefreshCw size={16} />
              )}
              Resend link
            </button>
          </div>

          {/* Back to Sign In */}
          <div className="pt-4 border-t border-border">
            <button
              onClick={() => onNavigate('signin')}
              className="text-sm text-primary hover:text-primary-hover flex items-center justify-center gap-2 mx-auto"
            >
              <ArrowLeft size={16} />
              Back to sign in
            </button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout variant="forgot">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-medium text-text">Forgot password?</h1>
          <p className="text-subtext">Enter your email and we'll send a reset link.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <AuthInput
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
            error={error}
            icon={<Mail size={18} />}
          />

          <AuthButton
            type="submit"
            variant="primary"
            loading={isLoading}
            disabled={!isFormValid}
            className="w-full"
          >
            Send reset link
          </AuthButton>
        </form>

        {/* Back to Sign In */}
        <div className="text-center">
          <button
            onClick={() => onNavigate('signin')}
            className="text-sm text-primary hover:text-primary-hover flex items-center justify-center gap-2 mx-auto"
          >
            <ArrowLeft size={16} />
            Back to sign in
          </button>
        </div>
      </div>
    </AuthLayout>
  );
}

// Reset Password Screen
export function ResetPasswordScreen({ onNavigate }: ResetPasswordScreenProps) {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [otpError, setOtpError] = useState('');

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.newPassword) {
      newErrors.newPassword = 'Password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = formData.newPassword.length >= 8 &&
                     formData.confirmPassword &&
                     formData.newPassword === formData.confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsLoading(false);
    toast.success('Password updated—sign in to continue');
    onNavigate('signin');
  };

  const handleVerifyOTP = async () => {
    if (otpValue.length !== 6) {
      setOtpError('Please enter the complete 6-digit code');
      return;
    }

    setIsLoading(true);
    setOtpError('');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsLoading(false);
    toast.success('Code verified—password updated');
    onNavigate('signin');
  };

  if (showOTP) {
    return (
      <AuthLayout variant="reset">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-medium text-text">Verify your code</h1>
            <p className="text-subtext">Enter the 6-digit code sent to your email</p>
          </div>

          {/* OTP Form */}
          <div className="space-y-5">
            <OTPInput
              value={otpValue}
              onChange={setOtpValue}
              error={otpError}
            />

            <AuthButton
              variant="primary"
              loading={isLoading}
              disabled={otpValue.length !== 6}
              onClick={handleVerifyOTP}
              className="w-full"
            >
              Verify Code
            </AuthButton>
          </div>

          {/* Back Option */}
          <div className="text-center">
            <button
              onClick={() => setShowOTP(false)}
              className="text-sm text-subtext hover:text-text flex items-center justify-center gap-2 mx-auto"
            >
              <ArrowLeft size={16} />
              Back to password reset
            </button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout variant="reset">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-medium text-text">Set a new password</h1>
          <p className="text-subtext">Choose a strong password to protect your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <AuthInput
              label="New Password"
              type="password"
              placeholder="Create a strong password"
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              error={errors.newPassword}
              icon={<Lock size={18} />}
              showPasswordToggle
            />
            <PasswordStrength password={formData.newPassword} className="px-4" />
          </div>

          <AuthInput
            label="Confirm New Password"
            type="password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            error={errors.confirmPassword}
            icon={<Lock size={18} />}
            showPasswordToggle
          />

          {/* Use Code Instead */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => setShowOTP(true)}
              className="text-sm text-primary hover:text-primary-hover underline"
            >
              Use code instead
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <AuthButton
              type="submit"
              variant="primary"
              loading={isLoading}
              disabled={!isFormValid}
              className="w-full"
            >
              Update Password
            </AuthButton>

            <AuthButton
              variant="ghost"
              onClick={() => onNavigate('signin')}
              className="w-full"
            >
              Cancel
            </AuthButton>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}