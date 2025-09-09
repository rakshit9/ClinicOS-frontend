import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface SignInScreenProps {
  onSignIn: () => void;
  onBack: () => void;
}

interface InputProps {
  id: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  icon: React.ReactNode;
  showPasswordToggle?: boolean;
  onTogglePassword?: () => void;
  showPassword?: boolean;
}

function CustomInput({ 
  id, 
  type, 
  placeholder, 
  value, 
  onChange, 
  error, 
  icon, 
  showPasswordToggle,
  onTogglePassword,
  showPassword
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <div className="space-y-2">
      <div className={`
        relative flex items-center
        bg-[--input-background] border border-[--border]
        rounded-3xl transition-all duration-200
        ${isFocused ? 'border-[--primary] ring-2 ring-[--primary]/20' : ''}
        ${error ? 'border-[--danger] ring-2 ring-[--danger]/20' : ''}
      `}>
        <div className="flex items-center justify-center w-12 h-12 text-[--subtext]">
          {icon}
        </div>
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="flex-1 bg-transparent border-0 outline-none px-0 pr-4 py-4 text-[--text] placeholder:text-[--subtext]"
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="flex items-center justify-center w-12 h-12 text-[--subtext] hover:text-[--text] transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && (
        <p className="text-[--danger] text-sm px-4">{error}</p>
      )}
    </div>
  );
}

interface CustomButtonProps {
  variant: 'primary' | 'secondary' | 'google';
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

function CustomButton({ variant, children, onClick, disabled = false, className = '' }: CustomButtonProps) {
  const baseClasses = "w-full h-14 rounded-3xl font-medium transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantClasses = {
    primary: `
      bg-[--primary] text-[--primary-foreground] 
      hover:bg-[--primary-hover] active:bg-[--primary-press]
      disabled:hover:bg-[--primary] shadow-sm
      focus:outline-none focus:ring-2 focus:ring-[--primary-hover]
    `,
    secondary: `
      bg-[--surface] text-[--text] border border-[--border]
      hover:bg-[--canvas] active:bg-[--border]/30
      focus:outline-none focus:ring-2 focus:ring-[--primary-hover]
    `,
    google: `
      bg-[--surface] text-[--text] border border-[--border]
      hover:bg-[--canvas] active:bg-[--border]/30
      focus:outline-none focus:ring-2 focus:ring-[--primary-hover]
    `
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

export function SignInScreen({ onSignIn, onBack }: SignInScreenProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [rememberMe, setRememberMe] = useState(false);
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
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const isFormValid = formData.email && formData.password && validateEmail(formData.email) && formData.password.length >= 6;
  
  const handleSignIn = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('Signed in successfully');
    setIsLoading(false);
    onSignIn();
  };
  
  const handleGoogleSignIn = () => {
    toast.success('Google Sign In - Feature coming soon');
  };
  
  const handleForgotPassword = () => {
    toast.info('Password reset link sent to your email');
  };
  
  const handleCreateAccount = () => {
    toast.info('Create account - Feature coming soon');
  };
  
  return (
    <div className="min-h-screen bg-[--canvas] flex">
      {/* Auth Card Side */}
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-[420px] bg-[--surface] border-[--border] shadow-lg">
          <div className="p-12 space-y-8">
            {/* Header */}
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-2xl bg-[--primary] flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-[--primary-foreground]" />
                  </div>
                  <span className="font-medium text-[--text]">Doctor Dashboard</span>
                </div>
                <h1 className="text-2xl font-medium text-[--text]">Welcome back</h1>
                <p className="text-[--subtext]">Sign in to your doctor dashboard</p>
              </div>
            </div>
            
            {/* Form */}
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSignIn(); }}>
              <div className="space-y-4">
                <CustomInput
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(value) => setFormData({ ...formData, email: value })}
                  error={errors.email}
                  icon={<Mail size={18} />}
                />
                
                <CustomInput
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(value) => setFormData({ ...formData, password: value })}
                  error={errors.password}
                  icon={<Lock size={18} />}
                  showPasswordToggle={true}
                  onTogglePassword={() => setShowPassword(!showPassword)}
                  showPassword={showPassword}
                />
              </div>
              
              {/* Remember me & Forgot password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`
                      w-5 h-5 rounded-lg border-2 transition-all duration-200 flex items-center justify-center
                      ${rememberMe 
                        ? 'bg-[--primary] border-[--primary]' 
                        : 'bg-[--surface] border-[--border] hover:border-[--primary]'
                      }
                    `}>
                      {rememberMe && (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path
                            d="M2 6L4.5 8.5L10 3"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-[--text] text-sm">Remember me</span>
                </label>
                
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-[--primary] text-sm hover:text-[--primary-hover] transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              
              {/* Sign In Button */}
              <CustomButton
                variant="primary"
                onClick={handleSignIn}
                disabled={!isFormValid || isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
                {!isLoading && <ArrowRight size={18} />}
              </CustomButton>
            </form>
            
            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[--border]" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-[--surface] px-4 text-[--subtext] text-sm">or</span>
              </div>
            </div>
            
            {/* Google Sign In */}
            <CustomButton
              variant="google"
              onClick={handleGoogleSignIn}
            >
              <GoogleIcon />
              Continue with Google
            </CustomButton>
            
            {/* Footer */}
            <div className="text-center">
              <button
                onClick={handleCreateAccount}
                className="text-[--subtext] hover:text-[--text] transition-colors"
              >
                New here? <span className="text-[--primary] hover:text-[--primary-hover]">Create an account</span>
              </button>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Hero Panel Side */}
      <div className="flex-1 relative overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1600947871775-082dd97e2d96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjbGluaWMlMjBpbnRlcmlvciUyMHdoaXRlJTIwYnJpZ2h0fGVufDF8fHx8MTc1NzEwMzA3Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Modern clinic interior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/60" />
          <div 
            className="absolute inset-0 opacity-40"
            style={{
              background: `radial-gradient(circle at 60% 40%, rgba(99, 91, 255, 0.15) 0%, transparent 50%)`
            }}
          />
        </div>
        
        {/* Content */}
        <div className="relative h-full flex items-center justify-center p-16">
          <div className="text-center space-y-8 max-w-md">
            <div className="space-y-6">
              <Badge 
                variant="secondary" 
                className="bg-white/80 text-[--text] border border-[--border]/50 px-4 py-2 rounded-full"
              >
                HIPAA Compliant
              </Badge>
              <h2 className="text-3xl font-medium text-[--text] leading-tight">
                Secure healthcare management for modern practices
              </h2>
              <p className="text-[--subtext] text-lg leading-relaxed">
                Streamline patient care with our comprehensive dashboard designed for healthcare professionals.
              </p>
            </div>
            
            <button
              onClick={onBack}
              className="text-[--primary] hover:text-[--primary-hover] transition-colors flex items-center gap-2 mx-auto"
            >
              ← Back to home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}