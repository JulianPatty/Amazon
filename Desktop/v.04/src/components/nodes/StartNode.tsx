import React, { useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Play, Info, Settings, Clock, Zap, Calendar, ExternalLink } from 'lucide-react';
import { WorkflowBlockData } from '../../types/workflow';
import { TooltipModal } from '../ui/TooltipModal';
import { DropdownMenu, Select } from '../ui/DropdownMenu';
import { WebhookConfigDialog } from '../dialogs/WebhookConfigDialog';
import { ScheduleDialog } from '../dialogs/ScheduleDialog';

interface StartNodeData extends WorkflowBlockData {
  config?: {
    triggerType?: 'manual' | 'webhook' | 'schedule';
    webhookProvider?: 'slack' | 'gmail' | 'airtable' | 'telegram' | 'generic';
    inputFields?: Array<{
      name: string;
      type: string;
      required: boolean;
    }>;
  };
}

export const StartNode: React.FC<NodeProps<StartNodeData>> = ({ 
  data, 
  selected 
}) => {
  const [triggerType, setTriggerType] = useState<string>(data.config?.triggerType || 'manual');
  const [webhookProvider, setWebhookProvider] = useState<string>(data.config?.webhookProvider || 'slack');

  const tooltipContent = (
    <div className="space-y-3">
      <div>
        <h4 className="font-semibold text-white mb-2">Description</h4>
        <p className="text-gray-200 text-sm leading-relaxed">
          Initiate your workflow manually, on a schedule, or via webhook triggers. 
          Configure flexible execution patterns with customizable timing options and 
          webhook security.
        </p>
      </div>
      
      <div>
        <h4 className="font-semibold text-white mb-2">Output</h4>
        <p className="text-gray-400 text-sm">response</p>
        <div className="mt-1">
          <span className="text-blue-400 text-sm">input:</span>
          <span className="text-green-400 text-sm ml-1">any</span>
        </div>
      </div>
    </div>
  );

  const triggerOptions = [
    { 
      value: 'manual', 
      label: 'Run manually',
      icon: Play
    },
    { 
      value: 'webhook', 
      label: 'On webhook call',
      icon: Zap
    },
    { 
      value: 'schedule', 
      label: 'On schedule',
      icon: Clock
    }
  ];

  const webhookProviderOptions = [
    { 
      value: 'slack', 
      label: 'Slack',
      icon: ExternalLink
    },
    { 
      value: 'gmail', 
      label: 'Gmail',
      icon: ExternalLink
    },
    { 
      value: 'airtable', 
      label: 'Airtable',
      icon: ExternalLink
    },
    { 
      value: 'telegram', 
      label: 'Telegram',
      icon: ExternalLink
    },
    { 
      value: 'generic', 
      label: 'Generic',
      icon: Settings
    }
  ];

  const handleWebhookConfigSave = (config: any) => {
    console.log('Webhook configuration saved:', config);
    // Here you would typically update the node's configuration
  };

  const handleScheduleConfigSave = (config: any) => {
    console.log('Schedule configuration saved:', config);
    // Here you would typically update the node's configuration
  };

  return (
    <div className={`bg-white rounded-lg border-2 shadow-sm min-w-[250px] ${
      selected ? 'border-blue-500' : 'border-gray-200'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-sky-50 rounded-t-lg border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-sky-500 rounded-md flex items-center justify-center mr-3">
            <Play className="h-4 w-4 text-white" />
          </div>
          <div>
            <div className="font-medium text-gray-900">Start</div>
            <div className="text-xs text-gray-500">Start Workflow</div>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <TooltipModal
            content={tooltipContent}
            title="Start Block"
            side="top"
            maxWidth="400px"
          >
            <button className="p-1 hover:bg-sky-100 rounded transition-colors duration-150">
              <Info className="h-4 w-4 text-gray-400" />
            </button>
          </TooltipModal>
          <button className="p-1 hover:bg-sky-100 rounded transition-colors duration-150">
            <Settings className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Start Workflow Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Workflow
          </label>
          <Select
            options={triggerOptions}
            value={triggerType}
            onValueChange={setTriggerType}
            placeholder="Select trigger type..."
            className="w-full"
          />
        </div>

        {/* Webhook Provider Section - Only show when webhook is selected */}
        {triggerType === 'webhook' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Webhook Provider
            </label>
            <Select
              options={webhookProviderOptions}
              value={webhookProvider}
              onValueChange={setWebhookProvider}
              placeholder="Select webhook provider..."
              className="w-full"
            />
          </div>
        )}

        {/* Webhook Configuration Section - Only show when webhook is selected */}
        {triggerType === 'webhook' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Webhook Configuration
            </label>
            <WebhookConfigDialog 
              provider={webhookProvider}
              onSave={handleWebhookConfigSave}
            >
              <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-150">
                <ExternalLink className="h-4 w-4 mr-2" />
                Configure Webhook
              </button>
            </WebhookConfigDialog>
          </div>
        )}

        {/* Schedule Configuration - Only show when schedule is selected */}
        {triggerType === 'schedule' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Schedule Configuration
            </label>
            <ScheduleDialog onSave={handleScheduleConfigSave}>
              <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-150">
                <Calendar className="h-4 w-4 mr-2" />
                Configure Schedule
              </button>
            </ScheduleDialog>
          </div>
        )}
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-blue-500 border-2 border-white"
      />
    </div>
  );
};