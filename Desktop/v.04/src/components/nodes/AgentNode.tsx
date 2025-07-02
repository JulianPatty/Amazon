import React, { useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Bot, Info, Settings, Plus, Trash2, Copy } from 'lucide-react';
import * as Form from '@radix-ui/react-form';
import * as Select from '@radix-ui/react-select';
import * as Slider from '@radix-ui/react-slider';
import { WorkflowBlockData } from '../../types/workflow';
import { TooltipModal } from '../ui/TooltipModal';
import { HoverCard } from '../ui/HoverCard';
import { cn } from '../../utils/cn';

interface AgentNodeData extends WorkflowBlockData {
  config?: {
    systemPrompt?: string;
    userPrompt?: string;
    model?: string;
    temperature?: number;
    tools?: Array<{
      id: string;
      name: string;
      description: string;
    }>;
    responseFormat?: string;
  };
}

const AI_MODELS = [
  // OpenAI Models
  { value: 'gpt-4o', label: 'GPT-4o', provider: 'OpenAI' },
  { value: 'gpt-4o-mini', label: 'GPT-4o Mini', provider: 'OpenAI' },
  { value: 'gpt-4-turbo', label: 'GPT-4 Turbo', provider: 'OpenAI' },
  { value: 'gpt-4', label: 'GPT-4', provider: 'OpenAI' },
  { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo', provider: 'OpenAI' },
  
  // Anthropic Models
  { value: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet', provider: 'Anthropic' },
  { value: 'claude-3-5-haiku-20241022', label: 'Claude 3.5 Haiku', provider: 'Anthropic' },
  { value: 'claude-3-opus-20240229', label: 'Claude 3 Opus', provider: 'Anthropic' },
  { value: 'claude-3-sonnet-20240229', label: 'Claude 3 Sonnet', provider: 'Anthropic' },
  { value: 'claude-3-haiku-20240307', label: 'Claude 3 Haiku', provider: 'Anthropic' },
  
  // Google Models
  { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro', provider: 'Google' },
  { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash', provider: 'Google' },
  { value: 'gemini-pro', label: 'Gemini Pro', provider: 'Google' },
  
  // Meta Models
  { value: 'llama-3.1-405b', label: 'Llama 3.1 405B', provider: 'Meta' },
  { value: 'llama-3.1-70b', label: 'Llama 3.1 70B', provider: 'Meta' },
  { value: 'llama-3.1-8b', label: 'Llama 3.1 8B', provider: 'Meta' },
  
  // Mistral Models
  { value: 'mistral-large-2', label: 'Mistral Large 2', provider: 'Mistral' },
  { value: 'mistral-small', label: 'Mistral Small', provider: 'Mistral' },
  { value: 'codestral', label: 'Codestral', provider: 'Mistral' },
  
  // Cohere Models
  { value: 'command-r-plus', label: 'Command R+', provider: 'Cohere' },
  { value: 'command-r', label: 'Command R', provider: 'Cohere' },
  
  // xAI Models
  { value: 'grok-beta', label: 'Grok Beta', provider: 'xAI' },
  
  // Perplexity Models
  { value: 'llama-3.1-sonar-large-128k-online', label: 'Sonar Large Online', provider: 'Perplexity' },
  { value: 'llama-3.1-sonar-small-128k-online', label: 'Sonar Small Online', provider: 'Perplexity' }
];

export const AgentNode: React.FC<NodeProps<AgentNodeData>> = ({ 
  data, 
  selected 
}) => {
  const [config, setConfig] = useState({
    systemPrompt: data.config?.systemPrompt || '',
    userPrompt: data.config?.userPrompt || '',
    model: data.config?.model || 'gpt-4o',
    temperature: data.config?.temperature || [1.0],
    tools: data.config?.tools || [],
    responseFormat: data.config?.responseFormat || ''
  });

  const tooltipContent = (
    <div className="space-y-3">
      <div>
        <h4 className="font-semibold text-white mb-2">Description</h4>
        <p className="text-gray-200 text-sm leading-relaxed">
          Configure an AI agent with custom prompts, model selection, and tools. 
          Set system instructions, user context, temperature for creativity control, 
          and response formatting.
        </p>
      </div>
      
      <div>
        <h4 className="font-semibold text-white mb-2">Output</h4>
        <p className="text-gray-400 text-sm">response</p>
        <div className="mt-1">
          <span className="text-blue-400 text-sm">content:</span>
          <span className="text-green-400 text-sm ml-1">string</span>
        </div>
      </div>
    </div>
  );

  const handleConfigChange = (key: string, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const addTool = () => {
    const newTool = {
      id: `tool-${Date.now()}`,
      name: 'New Tool',
      description: 'Tool description'
    };
    handleConfigChange('tools', [...config.tools, newTool]);
  };

  const removeTool = (toolId: string) => {
    handleConfigChange('tools', config.tools.filter(tool => tool.id !== toolId));
  };

  const copyResponseFormat = () => {
    navigator.clipboard.writeText(config.responseFormat);
  };

  // Settings Hover Card Content
  const SettingsHoverContent = () => (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
          <Settings className="h-4 w-4 text-white" />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">Agent Settings</h4>
          <p className="text-xs text-gray-500">Configure advanced options</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <p className="text-sm text-gray-700 leading-relaxed">
          Access advanced configuration options for your AI agent including model parameters, 
          execution settings, and output formatting.
        </p>
        
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Model Configuration</span>
            <span className="text-purple-600 font-medium">{config.model}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Temperature</span>
            <span className="text-purple-600 font-medium">{config.temperature[0].toFixed(1)}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Tools Enabled</span>
            <span className="text-purple-600 font-medium">{config.tools.length}</span>
          </div>
        </div>
        
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Configuration auto-saved</span>
          </div>
        </div>
        
        <button className="w-full mt-2 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs rounded-md transition-colors">
          Open Advanced Settings
        </button>
      </div>
    </div>
  );

  return (
    <div className={cn(
      "bg-white rounded-lg border-2 shadow-sm min-w-[400px] max-w-[500px]",
      selected ? 'border-blue-500' : 'border-gray-200'
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-purple-50 rounded-t-lg border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center mr-3">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <div>
            <div className="font-medium text-gray-900">Agent 1</div>
            <div className="text-xs text-gray-500">Build an agent</div>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <TooltipModal
            content={tooltipContent}
            title="Agent Block"
            side="top"
            maxWidth="400px"
          >
            <button className="p-1 hover:bg-purple-100 rounded transition-colors duration-150">
              <Info className="h-4 w-4 text-gray-400" />
            </button>
          </TooltipModal>
          
          <HoverCard
            content={<SettingsHoverContent />}
            side="bottom"
            align="end"
            openDelay={200}
            contentClassName="w-80"
          >
            <button className="p-1 hover:bg-purple-100 rounded transition-colors duration-150">
              <Settings className="h-4 w-4 text-gray-400" />
            </button>
          </HoverCard>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
        <Form.Root className="space-y-4">
          {/* System Prompt */}
          <Form.Field name="systemPrompt">
            <Form.Label className="block text-sm font-medium text-gray-900 mb-2">
              System Prompt
            </Form.Label>
            <Form.Control asChild>
              <textarea
                value={config.systemPrompt}
                onChange={(e) => handleConfigChange('systemPrompt', e.target.value)}
                placeholder="Enter system prompt..."
                className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none h-20"
              />
            </Form.Control>
          </Form.Field>

          {/* User Prompt */}
          <Form.Field name="userPrompt">
            <Form.Label className="block text-sm font-medium text-gray-900 mb-2">
              User Prompt
            </Form.Label>
            <Form.Control asChild>
              <textarea
                value={config.userPrompt}
                onChange={(e) => handleConfigChange('userPrompt', e.target.value)}
                placeholder="Enter context or user message..."
                className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none h-20"
              />
            </Form.Control>
          </Form.Field>

          {/* Model and Temperature Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Model Selection */}
            <Form.Field name="model">
              <Form.Label className="block text-sm font-medium text-gray-900 mb-2">
                Model <span className="text-red-500">*</span>
              </Form.Label>
              <Select.Root value={config.model} onValueChange={(value) => handleConfigChange('model', value)}>
                <Select.Trigger className="w-full flex items-center justify-between px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white">
                  <Select.Value />
                  <Select.Icon>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className="bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                    <Select.Viewport className="p-1">
                      {AI_MODELS.map((model) => (
                        <Select.Item
                          key={model.value}
                          value={model.value}
                          className="flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded-md outline-none data-[highlighted]:bg-purple-50 data-[state=checked]:bg-purple-100"
                        >
                          <Select.ItemText>
                            <div>
                              <div className="font-medium">{model.label}</div>
                              <div className="text-xs text-gray-500">{model.provider}</div>
                            </div>
                          </Select.ItemText>
                          <Select.ItemIndicator className="ml-auto">
                            <svg className="h-4 w-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
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

            {/* Temperature */}
            <Form.Field name="temperature">
              <Form.Label className="block text-sm font-medium text-gray-900 mb-2">
                Temperature
              </Form.Label>
              <div className="space-y-2">
                <Slider.Root
                  value={config.temperature}
                  onValueChange={(value) => handleConfigChange('temperature', value)}
                  max={2}
                  min={0}
                  step={0.1}
                  className="relative flex items-center select-none touch-none w-full h-5"
                >
                  <Slider.Track className="bg-gray-200 relative grow rounded-full h-2">
                    <Slider.Range className="absolute bg-purple-500 rounded-full h-full" />
                  </Slider.Track>
                  <Slider.Thumb className="block w-5 h-5 bg-white border-2 border-purple-500 rounded-full hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2" />
                </Slider.Root>
                <div className="text-center text-sm text-gray-600">
                  {config.temperature[0].toFixed(1)}
                </div>
              </div>
            </Form.Field>
          </div>

          {/* Tools */}
          <Form.Field name="tools">
            <Form.Label className="block text-sm font-medium text-gray-900 mb-2">
              Tools
            </Form.Label>
            <div className="space-y-2">
              {config.tools.map((tool) => (
                <div key={tool.id} className="flex items-center justify-between p-2 border border-gray-200 rounded-md">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{tool.name}</div>
                    <div className="text-xs text-gray-500">{tool.description}</div>
                  </div>
                  <button
                    onClick={() => removeTool(tool.id)}
                    className="p-1 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="h-3 w-3 text-red-500" />
                  </button>
                </div>
              ))}
              <button
                onClick={addTool}
                className="w-full flex items-center justify-center px-3 py-2 border-2 border-dashed border-gray-300 rounded-md text-sm text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Tool
              </button>
            </div>
          </Form.Field>

          {/* Response Format */}
          <Form.Field name="responseFormat">
            <Form.Label className="block text-sm font-medium text-gray-900 mb-2">
              Response Format
            </Form.Label>
            <div className="relative">
              <Form.Control asChild>
                <textarea
                  value={config.responseFormat}
                  onChange={(e) => handleConfigChange('responseFormat', e.target.value)}
                  placeholder="Enter JSON schema..."
                  className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none h-20 font-mono"
                />
              </Form.Control>
              <button
                onClick={copyResponseFormat}
                className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded transition-colors"
                title="Copy response format"
              >
                <Copy className="h-3 w-3 text-gray-400" />
              </button>
            </div>
          </Form.Field>
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