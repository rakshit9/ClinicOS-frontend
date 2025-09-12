import { useState } from 'react';
import { Search, Bell, ChevronDown, LogOut } from 'lucide-react';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { QuickFindOverlay } from './quick-find-overlay';
import { User } from '../services/authService';

interface TopBarProps {
  onPatientSelect?: (patientId: string) => void;
  user?: User | null;
  onLogout?: () => void;
}

export function TopBar({ onPatientSelect, user, onLogout }: TopBarProps) {
  const [showQuickFind, setShowQuickFind] = useState(false);
  
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });

  const handleSearchClick = () => {
    setShowQuickFind(true);
  };

  const handlePatientSelect = (patientId: string) => {
    if (onPatientSelect) {
      onPatientSelect(patientId);
    }
  };

  return (
    <>
      <div className="bg-surface border-b border-border h-16 px-6 flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-subtext w-4 h-4" />
            <Input
              placeholder="Search patients, MRN, or phone..."
              className="pl-10 bg-canvas border-border rounded-2xl cursor-pointer"
              onClick={handleSearchClick}
              readOnly
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1 text-subtext text-xs">
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5">
                <span>⌘K</span>
              </kbd>
            </div>
          </div>
        </div>
      
      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Date pill */}
        <div className="bg-canvas px-4 py-2 rounded-2xl text-subtext">
          {today}
        </div>
        
        {/* Notifications */}
        <div className="relative">
          <button className="p-2 rounded-2xl hover:bg-accent transition-colors">
            <Bell className="w-5 h-5 text-subtext" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-danger rounded-full"></div>
          </button>
        </div>
        
        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 p-2 rounded-2xl hover:bg-accent transition-colors">
              <Avatar className="w-8 h-8">
                <AvatarImage src="/api/placeholder/32/32" />
                <AvatarFallback>
                  {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'DR'}
                </AvatarFallback>
              </Avatar>
              <div className="text-left">
                <div className="text-text">{user?.name || 'Dr. User'}</div>
                <div className="text-subtext text-xs">{user?.speciality || 'Doctor'}</div>
              </div>
              <ChevronDown className="w-4 h-4 text-subtext" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 rounded-2xl border-border">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-danger cursor-pointer" 
              onClick={onLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>

    {/* Quick Find Overlay */}
    <QuickFindOverlay
      open={showQuickFind}
      onOpenChange={setShowQuickFind}
      onPatientSelect={handlePatientSelect}
    />
    </>
  );
}