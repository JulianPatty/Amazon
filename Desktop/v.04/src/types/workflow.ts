export enum BlockType {
  START = 'start',
  AGENT = 'agent',
  API = 'api',
  CONDITION = 'condition',
  FUNCTION = 'function',
  ROUTER = 'router',
  MEMORY = 'memory',
  KNOWLEDGE = 'knowledge',
  WORKFLOW = 'workflow',
  RESPONSE = 'response',
  LOOP = 'loop',
  TRANSFORM = 'transform',
  FILTER = 'filter',
  AGGREGATE = 'aggregate',
  INPUT = 'input',
  OUTPUT = 'output',
  NOTIFICATION = 'notification',
  DATABASE = 'database',
  WEBHOOK = 'webhook',
  DELAY = 'delay',
  GMAIL = 'gmail'
}

export interface WorkflowBlockData {
  label: string;
  description?: string;
  config?: Record<string, any>;
}

export interface WorkflowBlock {
  id: string;
  type: BlockType;
  position: { x: number; y: number };
  data: WorkflowBlockData;
}

export interface WorkflowConnection {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  blocks: WorkflowBlock[];
  connections: WorkflowConnection[];
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowFolder {
  id: string;
  name: string;
  workflows: string[];
}

export interface BlockTypeDefinition {
  type: BlockType;
  name: string;
  description: string;
  icon: string;
  color: string;
}