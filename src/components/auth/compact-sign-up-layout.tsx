import React from 'react';
import { Shield, Check, Zap, Users } from 'lucide-react';
import { cn } from '../ui/utils';
import { CompactSignUpCard } from './compact-sign-up-card';
import { AuthScreen } from './premium-sign-in';

interface CompactSignUpLayoutProps {
  onSuccess: () => void;
  onNavigate: (screen: AuthScreen) => void;
}

export function CompactSignUpLayout({ onSuccess, onNavigate }: CompactSignUpLayoutProps) {
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
            <span className="text-xl font-semibold">ClinicPilot</span>
          </div>
          
          {/* Content */}
          <div className="space-y-3">
            <h1 className="text-2xl font-semibold leading-tight">
              Transform your workflow with AI
            </h1>
            <p className="text-white/90 leading-relaxed">
              Join thousands of doctors using AI-powered tools to enhance patient care and practice efficiency.
            </p>
          </div>
        </div>
      </div>

      {/* Desktop: Left Hero Panel (48% width) */}
      <div className="hidden md:flex md:w-[48%] relative overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, #5B6BFF 0%, #14B8A6 100%)' }}
        />
        {/* Mesh texture */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h-2zM0 20h2v20H0V20zm4 0h2v20H4V20zm4 0h2v20H8V20zm4 0h2v20h-2V20zm4 0h2v20h-2V20zm4 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2z'/%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
        
        <div className="relative flex flex-col justify-center px-12 text-white">
          {/* Brand */}
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-semibold">ClinicPilot</span>
          </div>
          
          {/* Main content */}
          <div className="space-y-8 max-w-md">
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold leading-tight">
                Transform your workflow with AI
              </h1>
              <p className="text-xl text-white/90 leading-relaxed">
                Join thousands of doctors using AI-powered tools to enhance patient care and practice efficiency.
              </p>
            </div>
            
            {/* Feature highlights */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="text-white/90">AI-powered patient insights</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="text-white/90">Automated clinical workflows</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <span className="text-white/90">Enhanced patient care</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop: Right Form Panel (52% width) | Mobile: Full Width */}
      <div className={cn(
        "flex-1 md:w-[52%] bg-canvas",
        "flex items-center justify-center",
        "p-6 md:p-12"
      )}>
        <CompactSignUpCard onSuccess={onSuccess} onNavigate={onNavigate} />
      </div>
    </div>
  );
}