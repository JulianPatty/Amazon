import React, { useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { 
  Mail, 
  Info, 
  Settings, 
  ChevronDown, 
  Copy, 
  BookOpen, 
  Smartphone,
  ExternalLink,
  Shield,
  Zap,
  Clock
} from 'lucide-react';
import * as Form from '@radix-ui/react-form';
import * as Select from '@radix-ui/react-select';
import { WorkflowBlockData } from '../../types/workflow';
import { HoverCard } from '../ui/HoverCard';
import { cn } from '../../utils/cn';

interface GmailNodeData extends WorkflowBlockData {
  config?: {
    gmailAccount?: string;
    to?: string;
    subject?: string;
    body?: string;
    attachments?: string[];
    cc?: string;
    bcc?: string;
    replyTo?: string;
  };
}

const GMAIL_ACCOUNTS = [
  { value: 'help@setn.ai', label: 'help@setn.ai', verified: true },
  { value: 'support@setn.ai', label: 'support@setn.ai', verified: true },
  { value: 'noreply@setn.ai', label: 'noreply@setn.ai', verified: false }
];

export const GmailNode: React.FC<NodeProps<GmailNodeData>> = ({ 
  data, 
  selected 
}) => {
  const [config, setConfig] = useState({
    gmailAccount: data.config?.gmailAccount || 'help@setn.ai',
    to: data.config?.to || '',
    subject: data.config?.subject || '',
    body: data.config?.body || '',
    cc: data.config?.cc || '',
    bcc: data.config?.bcc || '',
    replyTo: data.config?.replyTo || ''
  });

  const handleConfigChange = (key: string, value: string) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const copyField = (value: string) => {
    navigator.clipboard.writeText(value);
  };

  // Hover Card Content Components
  const InfoHoverContent = () => (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
          <Mail className="h-4 w-4 text-white" />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">Gmail Integration</h4>
          <p className="text-xs text-gray-500">Send emails via Gmail API</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <p className="text-sm text-gray-700 leading-relaxed">
          Send professional emails through Gmail with support for attachments, 
          CC/BCC recipients, and custom reply-to addresses.
        </p>
        
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <Shield className="h-3 w-3" />
          <span>Secure OAuth 2.0 authentication</span>
        </div>
        
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <Zap className="h-3 w-3" />
          <span>Real-time delivery status</span>
        </div>
      </div>
    </div>
  );

  const DocsHoverContent = () => (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <BookOpen className="h-5 w-5 text-blue-600" />
        <h4 className="font-semibold text-gray-900">Documentation</h4>
      </div>
      
      <div className="space-y-2">
        <p className="text-sm text-gray-700">
          Learn how to configure and use the Gmail integration effectively.
        </p>
        
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Setup Guide</span>
            <ExternalLink className="h-3 w-3 text-gray-400" />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">API Reference</span>
            <ExternalLink className="h-3 w-3 text-gray-400" />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Best Practices</span>
            <ExternalLink className="h-3 w-3 text-gray-400" />
          </div>
        </div>
        
        <button className="w-full mt-2 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs rounded-md transition-colors">
          View Documentation
        </button>
      </div>
    </div>
  );

  const MobileHoverContent = () => (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Smartphone className="h-5 w-5 text-green-600" />
        <h4 className="font-semibold text-gray-900">Mobile Optimized</h4>
      </div>
      
      <div className="space-y-2">
        <p className="text-sm text-gray-700">
          Emails are automatically optimized for mobile devices with responsive design.
        </p>
        
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-gray-50 p-2 rounded">
            <div className="font-medium text-gray-900">📱 Mobile</div>
            <div className="text-gray-600">320px - 768px</div>
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <div className="font-medium text-gray-900">💻 Desktop</div>
            <div className="text-gray-600">768px+</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 text-xs text-green-600">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>Responsive templates enabled</span>
        </div>
      </div>
    </div>
  );

  const StatusHoverContent = () => (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        <h4 className="font-semibold text-gray-900">Connection Status</h4>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Gmail API</span>
          <span className="text-green-600 font-medium">Connected</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">OAuth Token</span>
          <span className="text-green-600 font-medium">Valid</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Rate Limit</span>
          <span className="text-blue-600 font-medium">98/100</span>
        </div>
        
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <Clock className="h-3 w-3" />
            <span>Last sync: 2 minutes ago</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={cn(
      "bg-white rounded-lg border-2 shadow-sm min-w-[400px] max-w-[500px]",
      selected ? 'border-blue-500' : 'border-gray-200'
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-red-50 rounded-t-lg border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center mr-3">
            <Mail className="h-4 w-4 text-white" />
          </div>
          <div>
            <div className="font-medium text-gray-900">Gmail 1</div>
            <div className="text-xs text-gray-500">Send Gmail</div>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <HoverCard
            content={<InfoHoverContent />}
            side="bottom"
            align="end"
            openDelay={200}
            contentClassName="w-80"
          >
            <button className="p-1 hover:bg-red-100 rounded transition-colors duration-150">
              <Info className="h-4 w-4 text-gray-400" />
            </button>
          </HoverCard>
          
          <HoverCard
            content={<DocsHoverContent />}
            side="bottom"
            align="end"
            openDelay={200}
            contentClassName="w-72"
          >
            <button className="p-1 hover:bg-red-100 rounded transition-colors duration-150">
              <BookOpen className="h-4 w-4 text-gray-400" />
            </button>
          </HoverCard>
          
          <HoverCard
            content={<MobileHoverContent />}
            side="bottom"
            align="end"
            openDelay={200}
            contentClassName="w-72"
          >
            <button className="p-1 hover:bg-red-100 rounded transition-colors duration-150">
              <Smartphone className="h-4 w-4 text-gray-400" />
            </button>
          </HoverCard>
          
          <HoverCard
            content={<StatusHoverContent />}
            side="bottom"
            align="end"
            openDelay={200}
            contentClassName="w-64"
          >
            <button className="p-1 hover:bg-red-100 rounded transition-colors duration-150">
              <div className="w-4 h-4 rounded-full bg-green-500 animate-pulse"></div>
            </button>
          </HoverCard>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
        <Form.Root className="space-y-4">
          {/* Gmail Account */}
          <Form.Field name="gmailAccount">
            <Form.Label className="block text-sm font-medium text-gray-900 mb-2">
              Gmail Account <span className="text-red-500">*</span>
            </Form.Label>
            <Select.Root value={config.gmailAccount} onValueChange={(value) => handleConfigChange('gmailAccount', value)}>
              <Select.Trigger className="w-full flex items-center justify-between px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white">
                <div className="flex items-center">
                  <div className="w-5 h-5 mr-2 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-4 h-4">
                      <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  </div>
                  <Select.Value />
                </div>
                <Select.Icon>
                  <ChevronDown className="h-4 w-4" />
                </Select.Icon>
              </Select.Trigger>
              <Select.Portal>
                <Select.Content className="bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                  <Select.Viewport className="p-1">
                    {GMAIL_ACCOUNTS.map((account) => (
                      <Select.Item
                        key={account.value}
                        value={account.value}
                        className="flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded-md outline-none data-[highlighted]:bg-red-50 data-[state=checked]:bg-red-100"
                      >
                        <div className="w-5 h-5 mr-2 flex items-center justify-center">
                          <svg viewBox="0 0 24 24" className="w-4 h-4">
                            <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                          </svg>
                        </div>
                        <Select.ItemText>
                          <div className="flex items-center justify-between w-full">
                            <span>{account.label}</span>
                            {account.verified && (
                              <div className="w-2 h-2 bg-green-500 rounded-full ml-2"></div>
                            )}
                          </div>
                        </Select.ItemText>
                        <Select.ItemIndicator className="ml-auto">
                          <svg className="h-4 w-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </Select.ItemIndicator>
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </Form.Field>

          {/* To */}
          <Form.Field name="to">
            <Form.Label className="block text-sm font-medium text-gray-900 mb-2">
              To
            </Form.Label>
            <Form.Control asChild>
              <input
                type="email"
                value={config.to}
                onChange={(e) => handleConfigChange('to', e.target.value)}
                placeholder="Recipient email address"
                className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </Form.Control>
          </Form.Field>

          {/* Subject */}
          <Form.Field name="subject">
            <Form.Label className="block text-sm font-medium text-gray-900 mb-2">
              Subject
            </Form.Label>
            <Form.Control asChild>
              <input
                type="text"
                value={config.subject}
                onChange={(e) => handleConfigChange('subject', e.target.value)}
                placeholder="Email subject"
                className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </Form.Control>
          </Form.Field>

          {/* Body */}
          <Form.Field name="body">
            <Form.Label className="block text-sm font-medium text-gray-900 mb-2">
              Body
            </Form.Label>
            <div className="relative">
              <Form.Control asChild>
                <textarea
                  value={config.body}
                  onChange={(e) => handleConfigChange('body', e.target.value)}
                  placeholder="Email content"
                  className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none h-32"
                />
              </Form.Control>
              <button
                onClick={() => copyField(config.body)}
                className="absolute bottom-2 right-2 p-1 hover:bg-gray-100 rounded transition-colors"
                title="Copy body content"
              >
                <Copy className="h-3 w-3 text-gray-400" />
              </button>
            </div>
          </Form.Field>

          {/* Advanced Options - Collapsible */}
          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
              <span>Advanced Options</span>
              <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
            </summary>
            
            <div className="mt-4 space-y-4 pl-4 border-l-2 border-gray-100">
              {/* CC */}
              <Form.Field name="cc">
                <Form.Label className="block text-sm font-medium text-gray-900 mb-2">
                  CC
                </Form.Label>
                <Form.Control asChild>
                  <input
                    type="email"
                    value={config.cc}
                    onChange={(e) => handleConfigChange('cc', e.target.value)}
                    placeholder="CC email addresses (comma separated)"
                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </Form.Control>
              </Form.Field>

              {/* BCC */}
              <Form.Field name="bcc">
                <Form.Label className="block text-sm font-medium text-gray-900 mb-2">
                  BCC
                </Form.Label>
                <Form.Control asChild>
                  <input
                    type="email"
                    value={config.bcc}
                    onChange={(e) => handleConfigChange('bcc', e.target.value)}
                    placeholder="BCC email addresses (comma separated)"
                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </Form.Control>
              </Form.Field>

              {/* Reply To */}
              <Form.Field name="replyTo">
                <Form.Label className="block text-sm font-medium text-gray-900 mb-2">
                  Reply To
                </Form.Label>
                <Form.Control asChild>
                  <input
                    type="email"
                    value={config.replyTo}
                    onChange={(e) => handleConfigChange('replyTo', e.target.value)}
                    placeholder="Reply-to email address"
                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </Form.Control>
              </Form.Field>
            </div>
          </details>
        </Form.Root>
      </div>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-gray-400 border-2 border-white"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-blue-500 border-2 border-white"
      />
    </div>
  );
};