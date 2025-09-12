import { useState } from 'react';
import { CompactSignUpLayout } from './compact-sign-up-layout';
import { AuroraLayout } from './aurora-layout';
import { AuroraButton } from './aurora-button';
import { toast } from 'sonner';
import { AuthScreen } from '../premium-auth-flow';

interface PremiumSignUpProps {
  onSuccess: () => void;
  onNavigate: (screen: AuthScreen) => void;
}

export function PremiumSignUp({ onSuccess, onNavigate }: PremiumSignUpProps) {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSuccess = () => {
    setShowSuccess(true);
    
    // Show success state for 2 seconds, then proceed
    setTimeout(() => {
      toast.success('Account created successfully!');
      onSuccess();
    }, 2000);
  };

  if (showSuccess) {
    return (
      <AuroraLayout variant="signup">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
            <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-medium text-text">Account created!</h1>
            <p className="text-subtext">Continue to availability setup.</p>
          </div>
          <AuroraButton variant="primary" className="w-full">
            Continue
          </AuroraButton>
        </div>
      </AuroraLayout>
    );
  }

  return (
    <CompactSignUpLayout onSuccess={handleSuccess} onNavigate={onNavigate} />
  );
}