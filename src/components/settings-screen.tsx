import { useState } from 'react';
import { User, Shield, Bell, Brain, Key, Monitor, Smartphone, Globe, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Separator } from './ui/separator';

type SettingsSection = 'account' | 'preferences' | 'security' | 'ai';

interface ActiveSession {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  current?: boolean;
}

export function SettingsScreen() {
  const [activeSection, setActiveSection] = useState<SettingsSection>('account');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Account Settings
  const [accountData, setAccountData] = useState({
    fullName: 'Dr. Sarah Chen',
    email: 'sarah.chen@doctordashboard.com',
    specialty: 'Internal Medicine',
    clinic: 'Cedar Medical Center'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Preferences
  const [preferences, setPreferences] = useState({
    defaultLandingPage: 'overview',
    emailNotifications: true,
    inAppNotifications: true
  });

  // Security
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false
  });

  // AI Settings
  const [aiSettings, setAiSettings] = useState({
    enableAISummaries: true,
    riskSensitivity: 'medium'
  });

  const activeSessions: ActiveSession[] = [
    {
      id: '1',
      device: 'Chrome on MacBook Pro',
      location: 'San Francisco, CA',
      lastActive: '2 minutes ago',
      current: true
    },
    {
      id: '2',
      device: 'Safari on iPhone',
      location: 'San Francisco, CA',
      lastActive: '1 hour ago'
    },
    {
      id: '3',
      device: 'Chrome on Windows',
      location: 'Los Angeles, CA',
      lastActive: '3 days ago'
    }
  ];

  const sections = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'preferences', label: 'Preferences', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'ai', label: 'AI', icon: Brain }
  ];

  const handleAccountChange = (field: string, value: string) => {
    setAccountData(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const handlePreferenceChange = (field: string, value: any) => {
    setPreferences(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const handleSecurityChange = (field: string, value: any) => {
    setSecuritySettings(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const handleAIChange = (field: string, value: any) => {
    setAiSettings(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    console.log('Saving settings...', {
      accountData,
      passwordData,
      preferences,
      securitySettings,
      aiSettings
    });
    setHasUnsavedChanges(false);
  };

  const handleCancel = () => {
    // Reset to original values
    setHasUnsavedChanges(false);
  };

  const handleSignOut = (sessionId: string) => {
    console.log('Signing out session:', sessionId);
  };

  const getDeviceIcon = (device: string) => {
    if (device.toLowerCase().includes('iphone') || device.toLowerCase().includes('android')) {
      return <Smartphone className="w-4 h-4 text-subtext" />;
    }
    return <Monitor className="w-4 h-4 text-subtext" />;
  };

  return (
    <div className="flex-1 bg-canvas">
      {/* Header */}
      <div className="px-8 py-6 border-b border-border bg-surface">
        <div className="max-w-[1440px] mx-auto">
          <h1 className="text-text text-2xl mb-2">Settings</h1>
          <p className="text-subtext">Manage your account, preferences, and security settings</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-12 gap-8">
            {/* Left: Navigation Anchors */}
            <div className="col-span-3">
              <div className="sticky top-8">
                <nav className="space-y-2">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id as SettingsSection)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all text-left ${
                          activeSection === section.id
                            ? 'bg-primary/10 text-primary border border-primary/20'
                            : 'text-subtext hover:text-text hover:bg-accent'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{section.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Right: Settings Panels */}
            <div className="col-span-9">
              <div className="space-y-8">
                {/* Account Settings */}
                {activeSection === 'account' && (
                  <div className="space-y-6">
                    {/* Basic Information */}
                    <Card className="bg-surface border border-border rounded-2xl">
                      <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-text">
                          <User className="w-5 h-5" />
                          Basic Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="fullName" className="text-text font-medium mb-2 block">
                              Full Name
                            </Label>
                            <Input
                              id="fullName"
                              value={accountData.fullName}
                              onChange={(e) => handleAccountChange('fullName', e.target.value)}
                              className="bg-input-background border-border rounded-2xl"
                            />
                          </div>
                          <div>
                            <Label htmlFor="email" className="text-text font-medium mb-2 block">
                              Email
                            </Label>
                            <Input
                              id="email"
                              value={accountData.email}
                              readOnly
                              className="bg-muted border-border rounded-2xl text-muted-foreground cursor-not-allowed"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="specialty" className="text-text font-medium mb-2 block">
                              Specialty
                            </Label>
                            <Input
                              id="specialty"
                              value={accountData.specialty}
                              onChange={(e) => handleAccountChange('specialty', e.target.value)}
                              className="bg-input-background border-border rounded-2xl"
                            />
                          </div>
                          <div>
                            <Label htmlFor="clinic" className="text-text font-medium mb-2 block">
                              Clinic
                            </Label>
                            <Input
                              id="clinic"
                              value={accountData.clinic}
                              onChange={(e) => handleAccountChange('clinic', e.target.value)}
                              className="bg-input-background border-border rounded-2xl"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Change Password */}
                    <Card className="bg-surface border border-border rounded-2xl">
                      <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-text">
                          <Key className="w-5 h-5" />
                          Change Password
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="currentPassword" className="text-text font-medium mb-2 block">
                            Current Password
                          </Label>
                          <Input
                            id="currentPassword"
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                            className="bg-input-background border-border rounded-2xl"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="newPassword" className="text-text font-medium mb-2 block">
                              New Password
                            </Label>
                            <Input
                              id="newPassword"
                              type="password"
                              value={passwordData.newPassword}
                              onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                              className="bg-input-background border-border rounded-2xl"
                            />
                          </div>
                          <div>
                            <Label htmlFor="confirmPassword" className="text-text font-medium mb-2 block">
                              Confirm Password
                            </Label>
                            <Input
                              id="confirmPassword"
                              type="password"
                              value={passwordData.confirmPassword}
                              onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                              className="bg-input-background border-border rounded-2xl"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Preferences */}
                {activeSection === 'preferences' && (
                  <div className="space-y-6">
                    <Card className="bg-surface border border-border rounded-2xl">
                      <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-text">
                          <Bell className="w-5 h-5" />
                          Preferences
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Default Landing Page */}
                        <div>
                          <Label className="text-text font-medium mb-3 block">
                            Default Landing Page
                          </Label>
                          <Select
                            value={preferences.defaultLandingPage}
                            onValueChange={(value) => handlePreferenceChange('defaultLandingPage', value)}
                          >
                            <SelectTrigger className="bg-input-background border-border rounded-2xl">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-surface border-border rounded-2xl">
                              <SelectItem value="overview">Overview</SelectItem>
                              <SelectItem value="patients">Patients</SelectItem>
                              <SelectItem value="appointments">Appointments</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <Separator className="bg-border" />

                        {/* Notifications */}
                        <div>
                          <h4 className="text-text font-medium mb-4">Notifications</h4>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-text font-medium">Email notifications</div>
                                <div className="text-subtext text-sm">Receive alerts and updates via email</div>
                              </div>
                              <Switch
                                checked={preferences.emailNotifications}
                                onCheckedChange={(checked) => handlePreferenceChange('emailNotifications', checked)}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-text font-medium">In-app notifications</div>
                                <div className="text-subtext text-sm">Show notifications within the application</div>
                              </div>
                              <Switch
                                checked={preferences.inAppNotifications}
                                onCheckedChange={(checked) => handlePreferenceChange('inAppNotifications', checked)}
                              />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Security */}
                {activeSection === 'security' && (
                  <div className="space-y-6">
                    {/* Two-Factor Authentication */}
                    <Card className="bg-surface border border-border rounded-2xl">
                      <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-text">
                          <Shield className="w-5 h-5" />
                          Two-Factor Authentication
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-text font-medium">Enable 2FA</div>
                            <div className="text-subtext text-sm">Add an extra layer of security to your account</div>
                          </div>
                          <Switch
                            checked={securitySettings.twoFactorEnabled}
                            onCheckedChange={(checked) => handleSecurityChange('twoFactorEnabled', checked)}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Active Sessions */}
                    <Card className="bg-surface border border-border rounded-2xl">
                      <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-text">
                          <Globe className="w-5 h-5" />
                          Active Sessions
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {activeSessions.map((session) => (
                            <div key={session.id} className="flex items-center justify-between p-4 bg-canvas rounded-2xl">
                              <div className="flex items-center gap-3">
                                {getDeviceIcon(session.device)}
                                <div>
                                  <div className="text-text font-medium flex items-center gap-2">
                                    {session.device}
                                    {session.current && (
                                      <span className="text-xs bg-success/10 text-success border border-success/20 rounded-lg px-2 py-0.5">
                                        Current
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-subtext text-sm">{session.location}</div>
                                  <div className="text-subtext text-xs">Last active: {session.lastActive}</div>
                                </div>
                              </div>
                              {!session.current && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleSignOut(session.id)}
                                  className="border border-border rounded-xl text-subtext hover:text-text px-3 py-2"
                                >
                                  <LogOut className="w-4 h-4 mr-2" />
                                  Sign out
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* AI Settings */}
                {activeSection === 'ai' && (
                  <div className="space-y-6">
                    <Card className="bg-surface border border-border rounded-2xl">
                      <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-text">
                          <Brain className="w-5 h-5" />
                          AI Features
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* AI Summaries Toggle */}
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-text font-medium">Enable AI report summaries</div>
                            <div className="text-subtext text-sm">Automatically generate summaries for lab reports and medical documents</div>
                          </div>
                          <Switch
                            checked={aiSettings.enableAISummaries}
                            onCheckedChange={(checked) => handleAIChange('enableAISummaries', checked)}
                          />
                        </div>

                        <Separator className="bg-border" />

                        {/* Risk Alert Sensitivity */}
                        <div>
                          <Label className="text-text font-medium mb-3 block">
                            Risk alert sensitivity
                          </Label>
                          <RadioGroup
                            value={aiSettings.riskSensitivity}
                            onValueChange={(value) => handleAIChange('riskSensitivity', value)}
                            className="space-y-3"
                          >
                            <div className="flex items-center space-x-3 p-3 rounded-2xl hover:bg-accent">
                              <RadioGroupItem value="low" id="low" />
                              <Label htmlFor="low" className="flex-1 cursor-pointer">
                                <div className="text-text font-medium">Low</div>
                                <div className="text-subtext text-sm">Only flag critical values that require immediate action</div>
                              </Label>
                            </div>
                            <div className="flex items-center space-x-3 p-3 rounded-2xl hover:bg-accent">
                              <RadioGroupItem value="medium" id="medium" />
                              <Label htmlFor="medium" className="flex-1 cursor-pointer">
                                <div className="text-text font-medium">Medium</div>
                                <div className="text-subtext text-sm">Flag abnormal values and trends that may need attention</div>
                              </Label>
                            </div>
                            <div className="flex items-center space-x-3 p-3 rounded-2xl hover:bg-accent">
                              <RadioGroupItem value="high" id="high" />
                              <Label htmlFor="high" className="flex-1 cursor-pointer">
                                <div className="text-text font-medium">High</div>
                                <div className="text-subtext text-sm">Flag all deviations from normal ranges for comprehensive review</div>
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Action Buttons */}
                {hasUnsavedChanges && (
                  <div className="flex items-center gap-4 p-6 bg-warning/5 border border-warning/20 rounded-2xl">
                    <div className="flex-1">
                      <div className="text-warning font-medium">Unsaved changes</div>
                      <div className="text-subtext text-sm">You have unsaved changes. Don't forget to save them.</div>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        variant="ghost"
                        onClick={handleCancel}
                        className="border border-border rounded-2xl text-subtext hover:text-text px-4 py-2"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSave}
                        className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-2xl px-6 py-2"
                      >
                        Save Changes
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}