import React from 'react';
import { Shield, Check, Zap, Users } from 'lucide-react';
import { cn } from '../ui/utils';

interface AuroraLayoutProps {
  children: React.ReactNode;
  variant?: 'signin' | 'signup' | 'forgot' | 'reset';
}

const variantContent = {
  signin: {
    title: "Transform your workflow with AI",
    subtitle: "Streamline patient care with intelligent automation and real-time insights for modern practices."
  },
  signup: {
    title: "Transform your workflow with AI", 
    subtitle: "Join thousands of doctors using AI-powered tools to enhance patient care and practice efficiency."
  },
  forgot: {
    title: "Transform your workflow with AI",
    subtitle: "Secure account recovery designed for healthcare professionals with enterprise-grade protection."
  },
  reset: {
    title: "Transform your workflow with AI",
    subtitle: "Create a secure password to protect your practice data and patient information."
  }
};

export function AuroraLayout({ children, variant = 'signin' }: AuroraLayoutProps) {
  const content = variantContent[variant];

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden h-[300px] relative overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, #5B6BFF 0%, #14B8A6 100%)' }}
        />
        {/* Subtle mesh texture */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h-2zM0 20h2v20H0V20zm4 0h2v20H4V20zm4 0h2v20H8V20zm4 0h2v20h-2V20zm4 0h2v20h-2V20zm4 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2z'/%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
        
        <div className="relative h-full flex flex-col justify-center px-6 text-white safe-area-inset-top">
          {/* Brand */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-medium">ClinicPilot</span>
          </div>
          
          {/* Content */}
          <div className="space-y-4">
            <h1 className="text-2xl font-medium leading-tight">
              {content.title}
            </h1>
            <p className="text-white/90 text-base leading-relaxed">
              {content.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Desktop Left Panel - Aurora Hero */}
      <div className="hidden md:flex md:w-[48%] relative overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, #5B6BFF 0%, #14B8A6 100%)' }}
        />
        {/* Subtle mesh texture */}
        <div 
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h-2zM0 20h2v20H0V20zm4 0h2v20H4V20zm4 0h2v20H8V20zm4 0h2v20h-2V20zm4 0h2v20h-2V20zm4 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2z'/%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
        
        <div className="relative flex flex-col justify-center px-12 lg:px-16 text-white max-w-lg">
          {/* Brand */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-medium">ClinicPilot</span>
          </div>
          
          {/* Main Content */}
          <div className="space-y-6 mb-12">
            <h1 className="text-4xl font-medium leading-tight">
              {content.title}
            </h1>
            <p className="text-white/90 text-lg leading-relaxed">
              {content.subtitle}
            </p>
          </div>
          
          {/* Features */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <Check className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-white/95">Enterprise-grade security</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <Zap className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-white/95">AI report summaries</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <Users className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-white/95">Trusted by modern practices</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form Card */}
      <div className="flex-1 md:w-[52%] flex items-center justify-center p-6 md:p-8 bg-canvas min-h-[calc(100vh-300px)] md:min-h-screen">
        <div className="w-full max-w-[440px]">
          <div className="bg-white rounded-2xl border border-border shadow-lg p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}