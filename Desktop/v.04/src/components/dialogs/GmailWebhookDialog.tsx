import React, { useState } from 'react';
import { Copy, Eye, EyeOff, ExternalLink, Info, ChevronDown, ChevronRight } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger 
} from '../ui/Dialog';
import { Button } from '../ui/Button';
import { Tooltip } from '../ui/Tooltip';
import { Select } from '../ui/DropdownMenu';

interface GmailWebhookDialogProps {
  children: React.ReactNode;
  onSave?: (config: GmailWebhookConfig) => void;
}

interface GmailWebhookConfig {
  webhookUrl: string;
  signingSecret: string;
  emailLabels: string[];
  labelFilterBehavior: 'include' | 'exclude';
  markAsRead: boolean;
  includeRawData: boolean;
}

const GMAIL_LABELS = [
  'Chat', 'Sent', 'Inbox', 'Important', 'Trash', 'Draft', 'Spam',
  'Forums', 'Updates', 'Personal', 'Promotions', 'Social', 'Starred', 'Unread'
];

export const GmailWebhookDialog: React.FC<GmailWebhookDialogProps> = ({
  children,
  onSave
}) => {
  const [open, setOpen] = useState(false);
  const [showSigningSecret, setShowSigningSecret] = useState(false);
  const [showPayloadExample, setShowPayloadExample] = useState(false);
  const [config, setConfig] = useState<GmailWebhookConfig>({
    webhookUrl: 'https://www.setn.ai/api/webhooks/trigger/7a690a5',
    signingSecret: '',
    emailLabels: ['Inbox'],
    labelFilterBehavior: 'include',
    markAsRead: false,
    includeRawData: false
  });

  const handleSave = () => {
    onSave?.(config);
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const toggleLabel = (label: string) => {
    setConfig(prev => ({
      ...prev,
      emailLabels: prev.emailLabels.includes(label)
        ? prev.emailLabels.filter(l => l !== label)
        : [...prev.emailLabels, label]
    }));
  };

  const labelFilterOptions = [
    { value: 'include', label: 'Include selected labels' },
    { value: 'exclude', label: 'Exclude selected labels' }
  ];

  const payloadExample = `{
  "message": {
    "data": "eyJlbWFpbEFkZHJlc3MiOiJ1c2VyQGV4YW1wbGUuY29tIiwiaGlzdG9yeUlkIjoiMTIzNDU2In0=",
    "messageId": "2070443601311540",
    "message_id": "2070443601311540",
    "publishTime": "2021-02-26T19:13:55.749Z",
    "publish_time": "2021-02-26T19:13:55.749Z"
  },
  "subscription": "projects/myproject/subscriptions/mysubscription"
}`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      <DialogContent size="xl" className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <span className="mr-2 text-lg">📧</span>
            Configure Gmail Webhook
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Webhook URL Section */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-900">
                Webhook URL
              </label>
              <Tooltip content="This is the URL that Gmail will send webhook events to">
                <Info className="h-4 w-4 text-gray-400" />
              </Tooltip>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={config.webhookUrl}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-sm font-mono text-gray-700 pr-10"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(config.webhookUrl)}
                className="px-3"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Signing Secret Section */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-900">
                Signing Secret
              </label>
              <Tooltip content="The secret key used to verify webhook authenticity">
                <Info className="h-4 w-4 text-gray-400" />
              </Tooltip>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <input
                  type={showSigningSecret ? 'text' : 'password'}
                  value={config.signingSecret}
                  onChange={(e) => setConfig(prev => ({ ...prev, signingSecret: e.target.value }))}
                  placeholder="Enter your Gmail app signing secret"
                  className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowSigningSecret(!showSigningSecret)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showSigningSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(config.signingSecret)}
                className="px-3"
                disabled={!config.signingSecret}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Email Labels to Monitor */}
          <div className="space-y-4 border-t border-gray-200 pt-6">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold text-gray-900">Email Labels to Monitor</h3>
              <Tooltip content="Select which Gmail labels to monitor for new emails">
                <Info className="h-4 w-4 text-gray-400" />
              </Tooltip>
            </div>
            
            <div className="grid grid-cols-6 gap-2">
              {GMAIL_LABELS.map((label) => (
                <button
                  key={label}
                  onClick={() => toggleLabel(label)}
                  className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                    config.emailLabels.includes(label)
                      ? label === 'Inbox'
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-200 text-gray-900'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Label Filter Behavior */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-900">
              Label Filter Behavior
            </label>
            <Select
              options={labelFilterOptions}
              value={config.labelFilterBehavior}
              onValueChange={(value) => setConfig(prev => ({ 
                ...prev, 
                labelFilterBehavior: value as 'include' | 'exclude' 
              }))}
              placeholder="Select filter behavior"
              className="w-full"
            />
          </div>

          {/* Email Processing Options */}
          <div className="space-y-4 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900">Email Processing Options</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">Mark emails as read after processing</span>
                  <Tooltip content="Automatically mark processed emails as read in Gmail">
                    <Info className="h-4 w-4 text-gray-400" />
                  </Tooltip>
                </div>
                <input
                  type="checkbox"
                  checked={config.markAsRead}
                  onChange={(e) => setConfig(prev => ({ ...prev, markAsRead: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">Include raw email data</span>
                  <Tooltip content="Include the full raw email content in the webhook payload">
                    <Info className="h-4 w-4 text-gray-400" />
                  </Tooltip>
                </div>
                <input
                  type="checkbox"
                  checked={config.includeRawData}
                  onChange={(e) => setConfig(prev => ({ ...prev, includeRawData: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Setup Instructions */}
          <div className="space-y-4 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900">Setup Instructions</h3>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">1</span>
                <span className="text-sm text-gray-700">
                  Go to{' '}
                  <a 
                    href="https://console.cloud.google.com/apis/credentials" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline inline-flex items-center"
                  >
                    Google Cloud Console
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </span>
              </div>

              <div className="flex items-start space-x-2">
                <span className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mt-0.5">2</span>
                <div className="flex-1">
                  <span className="text-sm text-gray-700">Enable the Gmail API and create credentials:</span>
                  <div className="space-y-1 ml-4 mt-1">
                    <div className="flex items-start space-x-2">
                      <span className="text-gray-400 mt-1">•</span>
                      <span className="text-sm text-gray-700">Create a new project or select an existing one</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-gray-400 mt-1">•</span>
                      <span className="text-sm text-gray-700">Enable the Gmail API</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-gray-400 mt-1">•</span>
                      <span className="text-sm text-gray-700">Create OAuth 2.0 credentials</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-gray-400 mt-1">•</span>
                      <span className="text-sm text-gray-700">Set up Pub/Sub topic and subscription</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <span className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mt-0.5">3</span>
                <span className="text-sm text-gray-700">Configure the webhook URL in your Pub/Sub subscription</span>
              </div>

              <div className="flex items-start space-x-2">
                <span className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mt-0.5">4</span>
                <span className="text-sm text-gray-700">Set up Gmail push notifications using the Gmail API</span>
              </div>
            </div>
          </div>

          {/* Gmail Event Payload Example */}
          <div className="space-y-4 border-t border-gray-200 pt-6">
            <button
              onClick={() => setShowPayloadExample(!showPayloadExample)}
              className="flex items-center space-x-2 text-lg font-semibold text-gray-900 hover:text-gray-700 transition-colors"
            >
              <span className="mr-2 text-lg">📧</span>
              <span>Gmail Event Payload Example</span>
              {showPayloadExample ? (
                <ChevronDown className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </button>
            
            {showPayloadExample && (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Your workflow will receive a payload similar to this when a new email arrives:
                </p>
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap">
                    {payloadExample}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!config.signingSecret.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};