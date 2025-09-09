import React, { useState } from 'react';
import { User, Mail, Building, Clock } from 'lucide-react';
import { cn } from '../ui/utils';
import { PremiumTextField } from './premium-text-field';
import { PremiumPasswordField } from './premium-password-field';
import { CompactSelect } from './compact-select';
import { CompactCheckbox } from './compact-checkbox';
import { PrimaryButton } from './primary-button';
import { GoogleButton } from './google-button';
import { toast } from 'sonner@2.0.3';
import { AuthScreen } from './premium-sign-in';

interface CompactSignUpCardProps {
  onSuccess: () => void;
  onNavigate: (screen: AuthScreen) => void;
}

const specialties = [
  { value: 'internal-medicine', label: 'Internal Medicine' },
  { value: 'family-practice', label: 'Family Practice' },
  { value: 'cardiology', label: 'Cardiology' },
  { value: 'dermatology', label: 'Dermatology' },
  { value: 'endocrinology', label: 'Endocrinology' },
  { value: 'gastroenterology', label: 'Gastroenterology' },
  { value: 'neurology', label: 'Neurology' },
  { value: 'oncology', label: 'Oncology' },
  { value: 'pediatrics', label: 'Pediatrics' },
  { value: 'psychiatry', label: 'Psychiatry' },
  { value: 'pulmonology', label: 'Pulmonology' },
  { value: 'radiology', label: 'Radiology' },
  { value: 'surgery', label: 'Surgery' },
  { value: 'other', label: 'Other' }
];

const timezones = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'America/Anchorage', label: 'Alaska Time (AKT)' },
  { value: 'Pacific/Honolulu', label: 'Hawaii Time (HT)' }
];

export function CompactSignUpCard({ onSuccess, onNavigate }: CompactSignUpCardProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    specialty: '',
    timezone: 'America/New_York', // Default from system
    clinicName: '',
    acceptTerms: false
  });
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  // Validation helpers
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const getPasswordStrength = (password: string) => {
    if (!password) return 0;
    if (password.length < 6) return 1;
    if (password.length < 10) return 2;
    return 3;
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!validateEmail(formData.email)) newErrors.email = 'Please enter a valid email';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    if (!formData.acceptTerms) newErrors.terms = 'You must agree to the Terms and Privacy Policy';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsLoading(false);
    toast.success('Account created successfully!');
    onSuccess();
  };

  const handleGoogleSignUp = () => {
    toast.success('Google Sign Up - Feature coming soon');
  };

  return (
    <div className="w-full max-w-[560px] mx-auto">
      {/* Card container */}
      <div className="bg-white rounded-3xl border border-border shadow-lg">
        {/* Content with padding and grid */}
        <div className="p-8 grid grid-cols-12 gap-6">
          {/* Header */}
          <div className="col-span-12 space-y-2">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-semibold text-text">Create your account</h1>
              <button
                onClick={() => onNavigate('signin')}
                className="text-sm text-primary hover:text-primary-hover underline"
              >
                Have an account? Sign in
              </button>
            </div>
            <p className="text-sm text-subtext">Start with core features—upgrade anytime</p>
          </div>

          {/* Section A - Account Details */}
          <div className="col-span-12 space-y-4">
            {/* Section label */}
            <div className="text-xs font-medium uppercase tracking-wide text-subtext">
              ACCOUNT DETAILS
            </div>
            
            {/* Row 1: Full Name | Work Email */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              <PremiumTextField
                label="Full name"
                placeholder="Dr. Sarah Chen"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                error={errors.fullName}
                icon={<User size={18} />}
                isValid={formData.fullName.trim().length > 0}
              />
              
              <PremiumTextField
                label="Work email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={errors.email}
                icon={<Mail size={18} />}
                isValid={validateEmail(formData.email)}
              />
            </div>

            {/* Row 2: Password | Confirm Password */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              <PremiumPasswordField
                label="Password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                error={errors.password}
                showStrengthMeter={true}
              />
              
              <PremiumPasswordField
                label="Confirm password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                error={errors.confirmPassword}
              />
            </div>
          </div>

          {/* Divider */}
          <div className="col-span-12">
            <div className="h-px bg-border my-3"></div>
          </div>

          {/* Section B - Practice Details */}
          <div className="col-span-12 space-y-4">
            {/* Section label */}
            <div className="text-xs font-medium uppercase tracking-wide text-subtext">
              PRACTICE DETAILS
            </div>
            
            {/* Row 3: Specialty | Time zone */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              <CompactSelect
                label="Specialty"
                value={formData.specialty}
                onValueChange={(value) => setFormData({ ...formData, specialty: value })}
                options={specialties}
                placeholder="Select your specialty"
                searchable={true}
              />
              
              <CompactSelect
                label="Time zone"
                value={formData.timezone}
                onValueChange={(value) => setFormData({ ...formData, timezone: value })}
                options={timezones}
              />
            </div>

            {/* Row 4: Clinic name (full width) */}
            <div className="grid grid-cols-1">
              <PremiumTextField
                label="Clinic name (optional)"
                placeholder="Downtown Medical Center"
                value={formData.clinicName}
                onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                icon={<Building size={18} />}
              />
            </div>
          </div>

          {/* Agreements */}
          <div className="col-span-12">
            <CompactCheckbox
              checked={formData.acceptTerms}
              onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
              error={errors.terms}
              label={
                <span className="leading-relaxed">
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
          </div>
        </div>

        {/* Sticky action bar */}
        <div className="border-t border-border bg-white rounded-b-3xl p-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <PrimaryButton
              type="submit"
              loading={isLoading}
              disabled={!isFormValid}
              onClick={handleSubmit}
              className="w-full sm:w-auto"
            >
              Create Account
            </PrimaryButton>
            
            <GoogleButton
              onClick={handleGoogleSignUp}
              className="w-full sm:w-auto"
            >
              Sign up with Google
            </GoogleButton>
          </div>
          
          <p className="text-xs text-subtext text-center">
            We'll email a confirmation. No spam.
          </p>
        </div>
      </div>
    </div>
  );
}