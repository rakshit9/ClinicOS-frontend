import React, { useState, Suspense, lazy } from 'react';
import { Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { ErrorBoundary } from './error-boundary';
import { Sidebar } from './sidebar';
import { TopBar } from './top-bar';
import { OverviewScreen } from './overview-screen';
import { PatientsScreenFallback } from './patients-screen-fallback';
import { PatientDetailScreen } from './patient-detail-screen';
import { AppointmentsScreen } from './appointments-screen';
import { AlertsScreen } from './alerts-screen';
import { SettingsScreen } from './settings-screen';
import { useAuth } from '../contexts/AuthContext';

// Lazy load the heavy patients screen
const PatientsScreen = lazy(() => 
  import('./patients-screen').then(module => ({ default: module.PatientsScreen }))
  .catch(() => ({ default: PatientsScreenFallback }))
);

type ActiveScreen = 'overview' | 'patients' | 'appointments' | 'alerts' | 'settings';

interface DashboardAppProps {
  onClose?: () => void;
}

// Dashboard Router Component
function DashboardRouter() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  // Get current screen from URL
  const getCurrentScreen = (): ActiveScreen => {
    const path = location.pathname.replace('/dashboard', '');
    if (path.startsWith('/patients')) return 'patients';
    if (path.startsWith('/appointments')) return 'appointments';
    if (path.startsWith('/alerts')) return 'alerts';
    if (path.startsWith('/settings')) return 'settings';
    return 'overview';
  };

  const handleScreenChange = (screen: ActiveScreen) => {
    navigate(`/dashboard/${screen}`);
  };

  const handlePatientClick = (patientId: string) => {
    // For now, we'll use patient ID in the URL
    // In a real implementation, you might want to use MRN instead
    navigate(`/dashboard/patients/${patientId}`);
  };

  const handleBackFromPatient = () => {
    navigate('/dashboard/patients');
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/'); // Navigate to landing page
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="h-screen flex bg-canvas">
      <Sidebar activeScreen={getCurrentScreen()} onScreenChange={handleScreenChange} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar user={user} onLogout={handleLogout} />
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<OverviewScreen />} />
            <Route path="/overview" element={<OverviewScreen />} />
            <Route path="/patients" element={
              <ErrorBoundary fallback={
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <p className="text-subtext">Error loading patients screen</p>
                    <Button onClick={() => window.location.reload()}>Reload</Button>
                  </div>
                </div>
              }>
                <Suspense fallback={<PatientsScreenFallback />}>
                  <PatientsScreen onPatientClick={handlePatientClick} />
                </Suspense>
              </ErrorBoundary>
            } />
            <Route path="/patients/:patientId" element={<PatientDetailScreenWrapper onBack={handleBackFromPatient} />} />
            <Route path="/appointments" element={<AppointmentsScreen onPatientClick={handlePatientClick} />} />
            <Route path="/alerts" element={<AlertsScreen onPatientClick={handlePatientClick} />} />
            <Route path="/settings" element={<SettingsScreen />} />
            <Route path="*" element={<OverviewScreen />} />
          </Routes>
        </ErrorBoundary>
      </div>
    </div>
  );
}

// Wrapper component for PatientDetailScreen to get patientId from URL params
function PatientDetailScreenWrapper({ onBack }: { onBack: () => void }) {
  const { patientId } = useParams<{ patientId: string }>();
  
  if (!patientId) {
    return <div>Patient not found</div>;
  }
  
  return <PatientDetailScreen patientId={patientId} onBack={onBack} />;
}

// Main DashboardApp component
export function DashboardApp({ onClose }: DashboardAppProps) {
  return (
    <div className="fixed inset-0 z-50 bg-canvas">
      {/* Close Button */}
      {onClose && (
        <div className="absolute top-4 right-4 z-60">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="w-10 h-10 p-0 rounded-2xl border border-border bg-surface/95 backdrop-blur-sm hover:bg-surface shadow-lg"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      <DashboardRouter />
    </div>
  );
}