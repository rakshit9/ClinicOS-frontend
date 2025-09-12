import { useState } from 'react';
import { Home, Users, Calendar, AlertTriangle, Settings, ChevronRight } from 'lucide-react';

type ActiveScreen = 'overview' | 'patients' | 'appointments' | 'alerts' | 'settings';

const sidebarItems = [
  { icon: Home, label: 'Overview', screen: 'overview' as ActiveScreen },
  { icon: Users, label: 'Patients', screen: 'patients' as ActiveScreen },
  { icon: Calendar, label: 'Appointments', screen: 'appointments' as ActiveScreen },
  { icon: AlertTriangle, label: 'Alerts', screen: 'alerts' as ActiveScreen },
  { icon: Settings, label: 'Settings', screen: 'settings' as ActiveScreen },
];

interface SidebarProps {
  activeScreen: ActiveScreen;
  onScreenChange: (screen: ActiveScreen) => void;
}

export function Sidebar({ activeScreen, onScreenChange }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      className={`bg-surface border-r border-border h-full transition-all duration-300 ${
        isExpanded ? 'w-64' : 'w-18'
      }`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-2xl flex items-center justify-center">
            <div className="w-4 h-4 bg-primary-foreground rounded-sm"></div>
          </div>
          {isExpanded && (
            <span className="text-text font-medium whitespace-nowrap">Doctor Dashboard</span>
          )}
        </div>
      </div>
      
      <nav className="px-3">
        {sidebarItems.map((item) => (
          <div key={item.label} className="mb-2">
            <div
              onClick={() => onScreenChange(item.screen)}
              className={`flex items-center gap-3 p-3 rounded-2xl transition-colors cursor-pointer ${
                activeScreen === item.screen
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-subtext hover:bg-accent hover:text-text'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {isExpanded && (
                <span className="whitespace-nowrap">{item.label}</span>
              )}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
}