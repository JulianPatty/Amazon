export interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'error' | 'warning' | 'info' | 'debug';
  message: string;
  source: string;
  workflowId?: string;
  workflowName?: string;
  blockId?: string;
  blockName?: string;
  trigger?: string;
  duration?: number;
  metadata?: Record<string, any>;
  stackTrace?: string;
}

export interface LogFilter {
  timeRange: 'all' | '1h' | '24h' | '7d' | '30d';
  level: 'all' | 'error' | 'warning' | 'info' | 'debug';
  trigger: 'all' | 'manual' | 'webhook' | 'schedule';
  workflow: 'all' | string;
  folder: 'all' | string;
}

export interface LogStats {
  total: number;
  errors: number;
  warnings: number;
  info: number;
  debug: number;
}