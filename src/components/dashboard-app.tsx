import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { Sidebar } from './sidebar';
import { TopBar } from './top-bar';
import { OverviewScreen } from './overview-screen';
import { PatientsScreen } from './patients-screen';
import { PatientDetailScreen } from './patient-detail-screen';
import { AppointmentsScreen } from './appointments-screen';
import { AlertsScreen } from './alerts-screen';
import { SettingsScreen } from './settings-screen';

type ActiveScreen = 'overview' | 'patients' | 'appointments' | 'alerts' | 'settings';
type ViewState = {
  screen: ActiveScreen;
  patientId?: string;
};

interface DashboardAppProps {
  onClose: () => void;
}

export function DashboardApp({ onClose }: DashboardAppProps) {
  const [viewState, setViewState] = useState<ViewState>({ screen: 'overview' });

  const handleScreenChange = (screen: ActiveScreen) => {
    setViewState({ screen });
  };

  const handlePatientClick = (patientId: string) => {
    setViewState({ screen: 'patients', patientId });
  };

  const handleBackFromPatient = () => {
    setViewState({ screen: 'patients' });
  };

  const renderActiveScreen = () => {
    if (viewState.screen === 'patients' && viewState.patientId) {
      return <PatientDetailScreen patientId={viewState.patientId} onBack={handleBackFromPatient} />;
    }

    switch (viewState.screen) {
      case 'overview':
        return <OverviewScreen />;
      case 'patients':
        return <PatientsScreen onPatientClick={handlePatientClick} />;
      case 'appointments':
        return <AppointmentsScreen onPatientClick={handlePatientClick} />;
      case 'alerts':
        return <AlertsScreen onPatientClick={handlePatientClick} />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <OverviewScreen />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-canvas">
      {/* Close Button */}
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

      <div className="h-screen flex bg-canvas">
        <Sidebar activeScreen={viewState.screen} onScreenChange={handleScreenChange} />
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar />
          {renderActiveScreen()}
        </div>
      </div>
    </div>
  );
}