import { Shield, Check, Zap, Users } from 'lucide-react';
import { cn } from '../ui/utils';

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  variant?: 'signin' | 'signup' | 'forgot' | 'reset';
}

const variantContent = {
  signin: {
    title: "Transform your workflow with AI",
    subtitle: "Streamline patient care with intelligent automation and real-time insights."
  },
  signup: {
    title: "Join thousands of doctors",
    subtitle: "Start transforming your practice with AI-powered tools and insights."
  },
  forgot: {
    title: "Secure password recovery",
    subtitle: "We'll help you regain access to your account safely and quickly."
  },
  reset: {
    title: "Create a secure password",
    subtitle: "Choose a strong password to protect your patient data and practice."
  }
};

export function AuthLayout({ children, variant = 'signin' }: AuthLayoutProps) {
  const content = variantContent[variant];

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden h-80 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-aurora-hero"
        />
        {/* Subtle texture overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='27' cy='27' r='1'/%3E%3Ccircle cx='47' cy='47' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
        
        <div className="relative h-full flex flex-col justify-center px-6 text-white">
          {/* Brand */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-medium">ClinicPilot</span>
          </div>
          
          {/* Content */}
          <div className="space-y-4">
            <h1 className="text-2xl font-medium leading-tight">
              {content.title}
            </h1>
            <p className="text-white/80 text-base leading-relaxed">
              {content.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Desktop Left Panel */}
      <div className="hidden md:flex md:w-[48%] relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-aurora-hero"
        />
        {/* Subtle texture overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='27' cy='27' r='1'/%3E%3Ccircle cx='47' cy='47' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
        
        <div className="relative flex flex-col justify-center px-12 lg:px-16 text-white max-w-lg">
          {/* Brand */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-medium">ClinicPilot</span>
          </div>
          
          {/* Main Content */}
          <div className="space-y-6 mb-12">
            <h1 className="text-4xl font-medium leading-tight">
              {content.title}
            </h1>
            <p className="text-white/80 text-lg leading-relaxed">
              {content.subtitle}
            </p>
          </div>
          
          {/* Features */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-white" />
              </div>
              <span className="text-white/90">Enterprise-grade security</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <Zap className="w-3 h-3 text-white" />
              </div>
              <span className="text-white/90">AI summaries for reports</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <Users className="w-3 h-3 text-white" />
              </div>
              <span className="text-white/90">Trusted by modern practices</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 md:w-[52%] flex items-center justify-center p-6 md:p-8 bg-canvas">
        <div className="w-full max-w-md">
          <div className="bg-surface rounded-2xl border border-border shadow-lg p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}