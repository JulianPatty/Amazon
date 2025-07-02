import React, { useState } from 'react';
import { 
  X, 
  Settings as SettingsIcon, 
  Key, 
  User, 
  Shield, 
  CreditCard, 
  Search,
  ChevronDown,
  Check,
  Info,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Mail,
  HardDrive,
  FileText,
  Sheet
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '../ui/Dialog';
import { Button } from '../ui/Button';
import { Select } from '../ui/DropdownMenu';
import { ScrollArea } from '../ui/ScrollArea';
import { cn } from '../../utils/cn';

interface SettingsDialogProps {
  children: React.ReactNode;
}

interface EnvironmentVariable {
  id: string;
  key: string;
  value: string;
  isSecret?: boolean;
}

interface Credential {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  isConnected: boolean;
  connectedAccount?: string;
}

type SettingsSection = 'general' | 'environment' | 'account' | 'credentials' | 'api-keys' | 'privacy' | 'subscription';

export const SettingsDialog: React.FC<SettingsDialogProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<SettingsSection>('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [credentialsSearchQuery, setCredentialsSearchQuery] = useState('');
  
  // General settings state
  const [theme, setTheme] = useState('light');
  const [debugMode, setDebugMode] = useState(false);
  const [autoConnect, setAutoConnect] = useState(true);
  const [autoFillEnvVars, setAutoFillEnvVars] = useState(true);
  
  // Environment variables state
  const [envVars, setEnvVars] = useState<EnvironmentVariable[]>([
    { id: '1', key: 'API_KEY', value: 'sk-1234567890abcdef', isSecret: true }
  ]);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  
  // Credentials state
  const [credentials] = useState<Credential[]>([
    {
      id: 'gmail',
      name: 'Gmail',
      description: 'Automate email workflows and enhance communication efficiency.',
      icon: Mail,
      isConnected: true,
      connectedAccount: 'help@setn.ai'
    },
    {
      id: 'google-drive',
      name: 'Google Drive',
      description: 'Streamline file organization and document workflows.',
      icon: HardDrive,
      isConnected: false
    },
    {
      id: 'google-docs',
      name: 'Google Docs',
      description: 'Create, read, and edit Google Documents programmatically.',
      icon: FileText,
      isConnected: false
    },
    {
      id: 'google-sheets',
      name: 'Google Sheets',
      description: 'Manage and analyze data with Google Sheets integration.',
      icon: Sheet,
      isConnected: false
    }
  ]);

  const themeOptions = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'System' }
  ];

  const sidebarItems = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'environment', label: 'Environment', icon: Key },
    { id: 'account', label: 'Account', icon: User },
    { id: 'credentials', label: 'Credentials', icon: Shield },
    { id: 'api-keys', label: 'API Keys', icon: Key },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'subscription', label: 'Subscription', icon: CreditCard }
  ];

  const handleAddEnvVar = () => {
    const newVar: EnvironmentVariable = {
      id: Date.now().toString(),
      key: '',
      value: '',
      isSecret: false
    };
    setEnvVars([...envVars, newVar]);
  };

  const handleUpdateEnvVar = (id: string, updates: Partial<EnvironmentVariable>) => {
    setEnvVars(envVars.map(envVar => 
      envVar.id === id ? { ...envVar, ...updates } : envVar
    ));
  };

  const handleDeleteEnvVar = (id: string) => {
    setEnvVars(envVars.filter(envVar => envVar.id !== id));
  };

  const toggleSecretVisibility = (id: string) => {
    setShowSecrets(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleConnectCredential = (id: string) => {
    console.log('Connect credential:', id);
  };

  const handleDisconnectCredential = (id: string) => {
    console.log('Disconnect credential:', id);
  };

  const filteredEnvVars = envVars.filter(envVar =>
    envVar.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
    envVar.value.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCredentials = credentials.filter(credential =>
    credential.name.toLowerCase().includes(credentialsSearchQuery.toLowerCase()) ||
    credential.description.toLowerCase().includes(credentialsSearchQuery.toLowerCase())
  );

  const renderGeneralSettings = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">General Settings</h2>
        
        <div className="space-y-6">
          {/* Theme */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-900">Theme</label>
            </div>
            <div className="w-48">
              <Select
                options={themeOptions}
                value={theme}
                onValueChange={setTheme}
                placeholder="Select theme"
              />
            </div>
          </div>

          {/* Debug Mode */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-900">Debug mode</label>
              <Info className="h-4 w-4 text-gray-400" />
            </div>
            <button
              onClick={() => setDebugMode(!debugMode)}
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                debugMode ? "bg-blue-600" : "bg-gray-200"
              )}
            >
              <span
                className={cn(
                  "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                  debugMode ? "translate-x-6" : "translate-x-1"
                )}
              />
            </button>
          </div>

          {/* Auto-connect on drop */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-900">Auto-connect on drop</label>
              <Info className="h-4 w-4 text-gray-400" />
            </div>
            <button
              onClick={() => setAutoConnect(!autoConnect)}
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                autoConnect ? "bg-blue-600" : "bg-gray-200"
              )}
            >
              <span
                className={cn(
                  "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                  autoConnect ? "translate-x-6" : "translate-x-1"
                )}
              />
            </button>
          </div>

          {/* Auto-fill environment variables */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-900">Auto-fill environment variables</label>
              <Info className="h-4 w-4 text-gray-400" />
            </div>
            <button
              onClick={() => setAutoFillEnvVars(!autoFillEnvVars)}
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                autoFillEnvVars ? "bg-blue-600" : "bg-gray-200"
              )}
            >
              <span
                className={cn(
                  "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                  autoFillEnvVars ? "translate-x-6" : "translate-x-1"
                )}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEnvironmentVariables = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Environment Variables</h2>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="space-y-4">
        {/* Header */}
        <div className="grid grid-cols-2 gap-4 text-sm font-medium text-gray-700 pb-2">
          <div>Key</div>
          <div>Value</div>
        </div>

        {/* Environment Variables */}
        <div className="space-y-3">
          {filteredEnvVars.map((envVar) => (
            <div key={envVar.id} className="grid grid-cols-2 gap-4 items-center">
              <input
                type="text"
                value={envVar.key}
                onChange={(e) => handleUpdateEnvVar(envVar.id, { key: e.target.value })}
                placeholder="Variable name"
                className="px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <input
                    type={showSecrets[envVar.id] ? 'text' : 'password'}
                    value={envVar.value}
                    onChange={(e) => handleUpdateEnvVar(envVar.id, { value: e.target.value })}
                    placeholder="Variable value"
                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-16"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => toggleSecretVisibility(envVar.id)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                    >
                      {showSecrets[envVar.id] ? (
                        <EyeOff className="h-3 w-3 text-gray-400" />
                      ) : (
                        <Eye className="h-3 w-3 text-gray-400" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteEnvVar(envVar.id)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                    >
                      <X className="h-3 w-3 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Variable Button */}
        <button
          onClick={handleAddEnvVar}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-md text-sm text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors"
        >
          Add Variable
        </button>
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <Button variant="outline" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button className="bg-gray-900 hover:bg-gray-800 text-white">
          Save Changes
        </Button>
      </div>
    </div>
  );

  const renderAccount = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Account</h2>
      
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-semibold text-lg">JP</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-900">Julian Patrick</h3>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
            <p className="text-sm text-gray-600">thechaosstation@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCredentials = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Credentials</h2>
          <p className="text-sm text-gray-600 mt-1">Connect your accounts to use tools that require authentication.</p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={credentialsSearchQuery}
            onChange={(e) => setCredentialsSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Google</h3>
        <div className="space-y-4">
          {filteredCredentials.map((credential) => (
            <div key={credential.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <credential.icon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{credential.name}</h4>
                    <p className="text-sm text-gray-600">{credential.description}</p>
                    {credential.isConnected && credential.connectedAccount && (
                      <div className="flex items-center space-x-1 mt-1">
                        <Check className="h-3 w-3 text-green-600" />
                        <span className="text-xs text-green-600">{credential.connectedAccount}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  {credential.isConnected ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDisconnectCredential(credential.id)}
                    >
                      Disconnect
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="bg-gray-900 hover:bg-gray-800 text-white"
                      onClick={() => handleConnectCredential(credential.id)}
                    >
                      Connect
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'general':
        return renderGeneralSettings();
      case 'environment':
        return renderEnvironmentVariables();
      case 'account':
        return renderAccount();
      case 'credentials':
        return renderCredentials();
      case 'api-keys':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">API Keys</h2>
            <p className="text-gray-600">API Keys management coming soon.</p>
          </div>
        );
      case 'privacy':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Privacy</h2>
            <p className="text-gray-600">Privacy settings coming soon.</p>
          </div>
        );
      case 'subscription':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Subscription</h2>
            <p className="text-gray-600">Subscription management coming soon.</p>
          </div>
        );
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      <DialogContent size="full" className="max-w-6xl h-[90vh] p-0" showCloseButton={false}>
        <DialogHeader className="sr-only">
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-72 bg-gray-50 border-r border-gray-200 flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Navigation */}
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-1">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id as SettingsSection)}
                    className={cn(
                      "w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      activeSection === item.id
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            <ScrollArea className="flex-1">
              <div className="p-8">
                {renderContent()}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};