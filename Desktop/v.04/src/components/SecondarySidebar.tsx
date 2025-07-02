import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Search, Blocks, Wrench } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { blockTypes } from '../data/blockTypes';
import { BlockType } from '../types/workflow';
import { Button } from './ui/Button';
import { Tooltip } from './ui/Tooltip';
import { Tabs } from './ui/Tabs';
import { ScrollArea } from './ui/ScrollArea';

interface SecondarySidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  onBlockDragStart: (blockType: BlockType) => void;
}

// Define integration tools with the same structure as blocks
const integrationTools = [
  {
    id: 'airtable',
    name: 'Airtable',
    description: 'Manage Airtable databases and records',
    icon: 'Database',
    color: 'bg-yellow-500',
    category: 'Database',
    blockType: BlockType.DATABASE
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'Interact with GitHub',
    icon: 'Github',
    color: 'bg-gray-900',
    category: 'Development',
    blockType: BlockType.API // Map to API block type
  },
  {
    id: 'gmail',
    name: 'Gmail',
    description: 'Send Gmail',
    icon: 'Mail',
    color: 'bg-red-500',
    category: 'Communication',
    blockType: BlockType.API
  },
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    description: 'Manage Google Calendar events',
    icon: 'Calendar',
    color: 'bg-blue-500',
    category: 'Productivity',
    blockType: BlockType.API
  },
  {
    id: 'google-docs',
    name: 'Google Docs',
    description: 'Read, write, and create documents',
    icon: 'FileText',
    color: 'bg-blue-600',
    category: 'Productivity',
    blockType: BlockType.API
  },
  {
    id: 'google-drive',
    name: 'Google Drive',
    description: 'Create, upload, and list files',
    icon: 'HardDrive',
    color: 'bg-green-500',
    category: 'Storage',
    blockType: BlockType.API
  },
  {
    id: 'google-search',
    name: 'Google Search',
    description: 'Search the web',
    icon: 'Search',
    color: 'bg-blue-500',
    category: 'Search',
    blockType: BlockType.API
  },
  {
    id: 'google-sheets',
    name: 'Google Sheets',
    description: 'Read, write, and update data',
    icon: 'Sheet',
    color: 'bg-green-600',
    category: 'Productivity',
    blockType: BlockType.API
  },
  {
    id: 'microsoft-excel',
    name: 'Microsoft Excel',
    description: 'Read, write, and update data',
    icon: 'FileSpreadsheet',
    color: 'bg-green-700',
    category: 'Productivity',
    blockType: BlockType.API
  },
  {
    id: 'microsoft-teams',
    name: 'Microsoft Teams',
    description: 'Read, write, and create messages',
    icon: 'Users',
    color: 'bg-purple-600',
    category: 'Communication',
    blockType: BlockType.API
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Send messages and interact with Slack',
    icon: 'MessageSquare',
    color: 'bg-purple-500',
    category: 'Communication',
    blockType: BlockType.API
  },
  {
    id: 'discord',
    name: 'Discord',
    description: 'Send messages and manage Discord servers',
    icon: 'MessageCircle',
    color: 'bg-indigo-600',
    category: 'Communication',
    blockType: BlockType.API
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'Create and manage Notion pages',
    icon: 'BookOpen',
    color: 'bg-gray-800',
    category: 'Productivity',
    blockType: BlockType.API
  },
  {
    id: 'trello',
    name: 'Trello',
    description: 'Manage Trello boards and cards',
    icon: 'Kanban',
    color: 'bg-blue-600',
    category: 'Project Management',
    blockType: BlockType.API
  },
  {
    id: 'asana',
    name: 'Asana',
    description: 'Manage Asana projects and tasks',
    icon: 'CheckSquare',
    color: 'bg-red-600',
    category: 'Project Management',
    blockType: BlockType.API
  },
  {
    id: 'jira',
    name: 'Jira',
    description: 'Manage Jira issues and projects',
    icon: 'Bug',
    color: 'bg-blue-700',
    category: 'Project Management',
    blockType: BlockType.API
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    description: 'Manage Salesforce CRM data',
    icon: 'Building',
    color: 'bg-blue-500',
    category: 'CRM',
    blockType: BlockType.API
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    description: 'Manage HubSpot CRM and marketing',
    icon: 'Users2',
    color: 'bg-orange-500',
    category: 'CRM',
    blockType: BlockType.API
  },
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Process payments and manage subscriptions',
    icon: 'CreditCard',
    color: 'bg-purple-600',
    category: 'Payments',
    blockType: BlockType.API
  },
  {
    id: 'paypal',
    name: 'PayPal',
    description: 'Process PayPal payments',
    icon: 'DollarSign',
    color: 'bg-blue-600',
    category: 'Payments',
    blockType: BlockType.API
  },
  {
    id: 'shopify',
    name: 'Shopify',
    description: 'Manage Shopify store and orders',
    icon: 'ShoppingCart',
    color: 'bg-green-600',
    category: 'E-commerce',
    blockType: BlockType.API
  },
  {
    id: 'woocommerce',
    name: 'WooCommerce',
    description: 'Manage WooCommerce store',
    icon: 'Store',
    color: 'bg-purple-700',
    category: 'E-commerce',
    blockType: BlockType.API
  },
  {
    id: 'twitter',
    name: 'Twitter',
    description: 'Post tweets and manage Twitter account',
    icon: 'Twitter',
    color: 'bg-blue-400',
    category: 'Social Media',
    blockType: BlockType.API
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    description: 'Manage LinkedIn posts and connections',
    icon: 'Linkedin',
    color: 'bg-blue-700',
    category: 'Social Media',
    blockType: BlockType.API
  }
];

export const SecondarySidebar: React.FC<SecondarySidebarProps> = ({
  isCollapsed,
  onToggle,
  onBlockDragStart
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [toolsSearchQuery, setToolsSearchQuery] = useState('');

  const filteredBlocks = blockTypes.filter(block => {
    const matchesSearch = block.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         block.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const filteredTools = integrationTools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(toolsSearchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(toolsSearchQuery.toLowerCase()) ||
                         tool.category.toLowerCase().includes(toolsSearchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleDragStart = (e: React.DragEvent, blockType: BlockType) => {
    e.dataTransfer.setData('application/reactflow', blockType);
    e.dataTransfer.effectAllowed = 'move';
    onBlockDragStart(blockType);
  };

  const handleToolDragStart = (e: React.DragEvent, tool: typeof integrationTools[0]) => {
    // Use the tool's mapped block type for drag and drop
    e.dataTransfer.setData('application/reactflow', tool.blockType);
    e.dataTransfer.setData('application/tool-config', JSON.stringify({
      toolId: tool.id,
      toolName: tool.name,
      toolDescription: tool.description,
      toolCategory: tool.category
    }));
    e.dataTransfer.effectAllowed = 'move';
    onBlockDragStart(tool.blockType);
  };

  const getIconComponent = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent ? <IconComponent className="h-4 w-4" /> : <LucideIcons.Square className="h-4 w-4" />;
  };

  // Blocks content component with ScrollArea
  const BlocksContent = () => (
    <div className="flex flex-col h-full">
      {/* Search - Fixed at top */}
      <div className="relative mb-4 flex-shrink-0">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search blocks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Scrollable Blocks List */}
      <ScrollArea className="flex-1 -mx-3">
        <div className="px-3 space-y-3 pb-4">
          {filteredBlocks.map((block) => (
            <div
              key={block.type}
              draggable
              onDragStart={(e) => handleDragStart(e, block.type)}
              className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-grab hover:bg-gray-100 hover:border-gray-300 transition-all active:cursor-grabbing hover:shadow-sm"
            >
              <div className={`w-8 h-8 ${block.color} rounded-md flex items-center justify-center text-white mr-3 flex-shrink-0`}>
                {getIconComponent(block.icon)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium text-gray-900 text-sm">
                  {block.name}
                </div>
                <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {block.description}
                </div>
              </div>
            </div>
          ))}
          
          {filteredBlocks.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No blocks found</p>
              <p className="text-xs text-gray-400 mt-1">Try adjusting your search terms</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );

  // Tools content component with ScrollArea and drag functionality
  const ToolsContent = () => (
    <div className="flex flex-col h-full">
      {/* Search - Fixed at top */}
      <div className="relative mb-4 flex-shrink-0">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search tools..."
          value={toolsSearchQuery}
          onChange={(e) => setToolsSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Scrollable Tools List with Drag and Drop */}
      <ScrollArea className="flex-1 -mx-3">
        <div className="px-3 space-y-3 pb-4">
          {filteredTools.map((tool) => (
            <div
              key={tool.id}
              draggable
              onDragStart={(e) => handleToolDragStart(e, tool)}
              className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-grab hover:bg-gray-100 hover:border-gray-300 transition-all active:cursor-grabbing hover:shadow-sm"
              title={`Drag to add ${tool.name} integration`}
            >
              <div className={`w-8 h-8 ${tool.color} rounded-md flex items-center justify-center text-white mr-3 flex-shrink-0`}>
                {getIconComponent(tool.icon)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium text-gray-900 text-sm">
                  {tool.name}
                </div>
                <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {tool.description}
                </div>
              </div>
            </div>
          ))}
          
          {filteredTools.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No tools found</p>
              <p className="text-xs text-gray-400 mt-1">Try adjusting your search terms</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );

  if (isCollapsed) {
    return (
      <>
        {/* Collapsed Sidebar - Clean and minimal with reduced width */}
        <div className="w-6 bg-white border-r border-gray-200 flex flex-col">
          {/* Empty space for visual balance */}
          <div className="flex-1" />
        </div>
        
        {/* External Toggle Button - Positioned outside and to the right */}
        <div className="relative">
          <div 
            className="absolute left-0 top-4 z-50"
            style={{ transform: 'translateX(-50%)' }}
          >
            <Tooltip content="Expand blocks" side="right">
              <Button
                variant="outline"
                size="sm"
                onClick={onToggle}
                className="w-8 h-8 p-0 bg-white border-gray-300 shadow-md hover:shadow-lg transition-all duration-200 rounded-full"
                aria-label="Expand navigation menu"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Tooltip>
          </div>
        </div>
      </>
    );
  }

  const tabItems = [
    {
      value: 'blocks',
      label: 'Blocks',
      icon: Blocks,
      content: <BlocksContent />
    },
    {
      value: 'tools',
      label: 'Tools',
      icon: Wrench,
      content: <ToolsContent />
    }
  ];

  return (
    <>
      {/* Expanded Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
        {/* Header - Fixed */}
        <div className="px-3 py-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-start">
            <Tabs
              items={tabItems}
              defaultValue="blocks"
              className="flex-1"
            />
          </div>
        </div>

        {/* Content Area - Scrollable */}
        <div className="flex-1 px-3 py-4 min-h-0">
          {/* Content is now handled by the Tabs component with ScrollArea */}
        </div>
      </div>
      
      {/* External Toggle Button - Positioned outside and to the right */}
      <div className="relative">
        <div 
          className="absolute left-0 top-4 z-50"
          style={{ transform: 'translateX(-50%)' }}
        >
          <Tooltip content="Collapse blocks" side="right">
            <Button
              variant="outline"
              size="sm"
              onClick={onToggle}
              className="w-8 h-8 p-0 bg-white border-gray-300 shadow-md hover:shadow-lg transition-all duration-200 rounded-full"
              aria-label="Collapse navigation menu"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Tooltip>
        </div>
      </div>
    </>
  );
};