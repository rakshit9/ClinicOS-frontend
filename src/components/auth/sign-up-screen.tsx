import React, { useState } from 'react';
import { Mail, Lock, User, Building } from 'lucide-react';
import { AuthLayout } from './auth-layout';
import { AuthInput } from './auth-input';
import { AuthButton } from './auth-button';
import { AuthCheckbox } from './auth-checkbox';
import { AuthDivider } from './auth-divider';
import { GoogleIcon } from './google-icon';
import { PasswordStrength } from './password-strength';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner@2.0.3';
import { AuthScreen } from './sign-in-screen';

interface SignUpScreenProps {
  onSuccess: () => void;
  onNavigate: (screen: AuthScreen) => void;
}

const specialties = [
  'Internal Medicine',
  'Family Practice',
  'Cardiology',
  'Dermatology',
  'Endocrinology',
  'Gastroenterology',
  'Neurology',
  'Oncology',
  'Pediatrics',
  'Psychiatry',
  'Pulmonology',
  'Radiology',
  'Surgery',
  'Other'
];

const timezones = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'America/Anchorage', label: 'Alaska Time (AKT)' },
  { value: 'Pacific/Honolulu', label: 'Hawaii Time (HT)' }
];

export function SignUpScreen({ onSuccess, onNavigate }: SignUpScreenProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    specialty: '',
    timezone: 'America/New_York',
    clinicName: '',
    acceptTerms: false
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.acceptTerms) {
      newErrors.terms = 'You must agree to the Terms and Privacy Policy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = formData.fullName.trim() &&
                     formData.email &&
                     validateEmail(formData.email) &&
                     formData.password.length >= 8 &&
                     formData.confirmPassword &&
                     formData.password === formData.confirmPassword &&
                     formData.acceptTerms;

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsLoading(false);
    setShowSuccess(true);

    // Show success state for 2 seconds, then proceed
    setTimeout(() => {
      toast.success('Account created successfully!');
      onSuccess();
    }, 2000);
  };

  const handleGoogleSignUp = () => {
    toast.success('Google Sign Up - Feature coming soon');
  };

  if (showSuccess) {
    return (
      <AuthLayout variant="signup">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
            <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-medium text-text">Account created!</h1>
            <p className="text-subtext">Continue to availability setup.</p>
          </div>
          <AuthButton variant="primary" className="w-full">
            Continue
          </AuthButton>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout variant="signup">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-medium text-text">Create your account</h1>
          <p className="text-subtext">Start with core features—upgrade anytime</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignUp} className="space-y-5">
          {/* Desktop: Two Column, Mobile: Single Column */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AuthInput
              label="Full Name"
              type="text"
              placeholder="Dr. Sarah Chen"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              error={errors.fullName}
              icon={<User size={18} />}
            />

            <AuthInput
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email}
              icon={<Mail size={18} />}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <AuthInput
                label="Password"
                type="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                error={errors.password}
                icon={<Lock size={18} />}
                showPasswordToggle
              />
              <PasswordStrength password={formData.password} className="px-4" />
            </div>

            <AuthInput
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              error={errors.confirmPassword}
              icon={<Lock size={18} />}
              showPasswordToggle
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text">
                Specialty
              </label>
              <Select value={formData.specialty} onValueChange={(value) => setFormData({ ...formData, specialty: value })}>
                <SelectTrigger className="h-12 md:h-11">
                  <SelectValue placeholder="Select your specialty" />
                </SelectTrigger>
                <SelectContent>
                  {specialties.map((specialty) => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-text">
                Time Zone
              </label>
              <Select value={formData.timezone} onValueChange={(value) => setFormData({ ...formData, timezone: value })}>
                <SelectTrigger className="h-12 md:h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <AuthInput
            label="Clinic Name (optional)"
            type="text"
            placeholder="Downtown Medical Center"
            value={formData.clinicName}
            onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
            icon={<Building size={18} />}
          />

          {/* Terms Agreement */}
          <AuthCheckbox
            checked={formData.acceptTerms}
            onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
            error={errors.terms}
            label={
              <span>
                I agree to the{' '}
                <button type="button" className="text-primary hover:text-primary-hover underline">
                  Terms of Service
                </button>{' '}
                and{' '}
                <button type="button" className="text-primary hover:text-primary-hover underline">
                  Privacy Policy
                </button>
              </span>
            }
          />

          {/* Actions - Desktop: Side by side, Mobile: Stacked */}
          <div className="flex flex-col md:flex-row gap-3">
            <AuthButton
              type="submit"
              variant="primary"
              loading={isLoading}
              disabled={!isFormValid}
              className="w-full"
            >
              Create Account
            </AuthButton>

            <AuthButton
              variant="google"
              onClick={handleGoogleSignUp}
              className="w-full"
            >
              <GoogleIcon />
              Sign up with Google
            </AuthButton>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center">
          <span className="text-subtext text-sm">Already have an account? </span>
          <button
            onClick={() => onNavigate('signin')}
            className="text-sm text-primary hover:text-primary-hover font-medium underline"
          >
            Sign in
          </button>
        </div>
      </div>
    </AuthLayout>
  );
}