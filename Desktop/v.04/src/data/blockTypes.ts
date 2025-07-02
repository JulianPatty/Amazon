import { BlockType, BlockTypeDefinition } from '../types/workflow';

export const blockTypes: BlockTypeDefinition[] = [
  // AI Blocks
  {
    type: BlockType.AGENT,
    name: 'Agent',
    description: 'Build an agent',
    icon: 'Bot',
    color: 'bg-purple-500'
  },

  // Integration Blocks
  {
    type: BlockType.API,
    name: 'API',
    description: 'Use any API',
    icon: 'Globe',
    color: 'bg-blue-500'
  },
  {
    type: BlockType.DATABASE,
    name: 'Database',
    description: 'Database operations',
    icon: 'Database',
    color: 'bg-blue-500'
  },
  {
    type: BlockType.WEBHOOK,
    name: 'Webhook',
    description: 'Receive webhooks',
    icon: 'Webhook',
    color: 'bg-blue-500'
  },

  // Logic Blocks
  {
    type: BlockType.CONDITION,
    name: 'Condition',
    description: 'Add a condition',
    icon: 'GitBranch',
    color: 'bg-orange-500'
  },
  {
    type: BlockType.FUNCTION,
    name: 'Function',
    description: 'Run custom logic',
    icon: 'Code',
    color: 'bg-red-500'
  },
  {
    type: BlockType.ROUTER,
    name: 'Router',
    description: 'Route workflow',
    icon: 'Route',
    color: 'bg-green-500'
  },
  {
    type: BlockType.LOOP,
    name: 'Loop',
    description: 'Iterate over items',
    icon: 'RotateCcw',
    color: 'bg-purple-600'
  },

  // Data Blocks
  {
    type: BlockType.TRANSFORM,
    name: 'Transform',
    description: 'Transform data',
    icon: 'Shuffle',
    color: 'bg-teal-500'
  },
  {
    type: BlockType.FILTER,
    name: 'Filter',
    description: 'Filter data',
    icon: 'Filter',
    color: 'bg-teal-500'
  },
  {
    type: BlockType.AGGREGATE,
    name: 'Aggregate',
    description: 'Aggregate data',
    icon: 'BarChart3',
    color: 'bg-teal-500'
  },

  // Control Blocks
  {
    type: BlockType.MEMORY,
    name: 'Memory',
    description: 'Add memory store',
    icon: 'HardDrive',
    color: 'bg-pink-500'
  },
  {
    type: BlockType.KNOWLEDGE,
    name: 'Knowledge',
    description: 'Use vector search',
    icon: 'BookOpen',
    color: 'bg-cyan-500'
  },
  {
    type: BlockType.WORKFLOW,
    name: 'Workflow',
    description: 'Execute another workflow',
    icon: 'Workflow',
    color: 'bg-amber-500'
  },
  {
    type: BlockType.DELAY,
    name: 'Delay',
    description: 'Add delay',
    icon: 'Clock',
    color: 'bg-gray-500'
  },

  // Output Blocks
  {
    type: BlockType.INPUT,
    name: 'Input',
    description: 'User input',
    icon: 'ArrowDown',
    color: 'bg-emerald-500'
  },
  {
    type: BlockType.OUTPUT,
    name: 'Output',
    description: 'Workflow output',
    icon: 'ArrowUp',
    color: 'bg-emerald-500'
  },
  {
    type: BlockType.RESPONSE,
    name: 'Response',
    description: 'Send a structured response',
    icon: 'MessageSquare',
    color: 'bg-blue-600'
  },
  {
    type: BlockType.NOTIFICATION,
    name: 'Notification',
    description: 'Send notification',
    icon: 'Bell',
    color: 'bg-yellow-500'
  }
];