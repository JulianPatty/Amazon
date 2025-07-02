import { LogEntry } from '../types/logs';

export const mockLogs: LogEntry[] = [
  {
    id: '9576',
    timestamp: new Date('2025-06-24T19:04:48Z'),
    level: 'error',
    message: 'Scheduled workflow execution failed: Cannot read properties of null (reading \'match\')',
    source: 'Workflow Engine',
    workflowId: 'workflow-0',
    workflowName: 'Workflow 0',
    trigger: 'schedule',
    duration: undefined,
    metadata: {
      executionId: '9576',
      errorCode: 'NULL_REFERENCE',
      retryCount: 0
    }
  },
  {
    id: '9575',
    timestamp: new Date('2025-06-24T19:04:48Z'),
    level: 'error',
    message: 'Block Function 1 (function): Cannot read properties of null (reading \'match\')',
    source: 'Function Block',
    workflowId: 'workflow-0',
    workflowName: 'Workflow 0',
    blockId: 'function-1',
    blockName: 'Function 1',
    trigger: 'schedule',
    duration: undefined,
    metadata: {
      executionId: '9576',
      blockType: 'function',
      errorCode: 'NULL_REFERENCE'
    }
  },
  {
    id: '9d18',
    timestamp: new Date('2025-06-24T19:02:48Z'),
    level: 'error',
    message: 'Scheduled workflow execution failed: Cannot read properties of null (reading \'match\')',
    source: 'Workflow Engine',
    workflowId: 'workflow-0',
    workflowName: 'Workflow 0',
    trigger: 'schedule',
    duration: undefined,
    metadata: {
      executionId: '9d18',
      errorCode: 'NULL_REFERENCE',
      retryCount: 1
    }
  },
  {
    id: '9d17',
    timestamp: new Date('2025-06-24T19:02:48Z'),
    level: 'error',
    message: 'Block Function 1 (function): Cannot read properties of null (reading \'match\')',
    source: 'Function Block',
    workflowId: 'workflow-0',
    workflowName: 'Workflow 0',
    blockId: 'function-1',
    blockName: 'Function 1',
    trigger: 'schedule',
    duration: undefined,
    metadata: {
      executionId: '9d18',
      blockType: 'function',
      errorCode: 'NULL_REFERENCE'
    }
  },
  {
    id: '6314',
    timestamp: new Date('2025-06-24T19:00:49Z'),
    level: 'error',
    message: 'Scheduled workflow execution failed: Cannot read properties of null (reading \'match\')',
    source: 'Workflow Engine',
    workflowId: 'workflow-0',
    workflowName: 'Workflow 0',
    trigger: 'schedule',
    duration: undefined,
    metadata: {
      executionId: '6314',
      errorCode: 'NULL_REFERENCE',
      retryCount: 2
    }
  },
  {
    id: '6313',
    timestamp: new Date('2025-06-24T19:00:48Z'),
    level: 'error',
    message: 'Block Function 1 (function): Cannot read properties of null (reading \'match\')',
    source: 'Function Block',
    workflowId: 'workflow-0',
    workflowName: 'Workflow 0',
    blockId: 'function-1',
    blockName: 'Function 1',
    trigger: 'schedule',
    duration: undefined,
    metadata: {
      executionId: '6314',
      blockType: 'function',
      errorCode: 'NULL_REFERENCE'
    }
  },
  {
    id: '71c4',
    timestamp: new Date('2025-06-04T16:12:31Z'),
    level: 'error',
    message: 'Scheduled workflow execution failed: Starter block must have at least one outgoing connection',
    source: 'Workflow Engine',
    workflowId: 'workflow-0',
    workflowName: 'Workflow 0',
    trigger: 'schedule',
    duration: undefined,
    metadata: {
      executionId: '71c4',
      errorCode: 'INVALID_WORKFLOW',
      validationError: 'Missing connections'
    }
  },
  {
    id: '4962',
    timestamp: new Date('2025-06-04T16:10:31Z'),
    level: 'error',
    message: 'Scheduled workflow execution failed: Starter block must have at least one outgoing connection',
    source: 'Workflow Engine',
    workflowId: 'workflow-0',
    workflowName: 'Workflow 0',
    trigger: 'schedule',
    duration: undefined,
    metadata: {
      executionId: '4962',
      errorCode: 'INVALID_WORKFLOW',
      validationError: 'Missing connections'
    }
  },
  {
    id: '0da1',
    timestamp: new Date('2025-06-04T16:08:32Z'),
    level: 'error',
    message: 'Scheduled workflow execution failed: Starter block must have at least one outgoing connection',
    source: 'Workflow Engine',
    workflowId: 'workflow-0',
    workflowName: 'Workflow 0',
    trigger: 'schedule',
    duration: undefined,
    metadata: {
      executionId: '0da1',
      errorCode: 'INVALID_WORKFLOW',
      validationError: 'Missing connections'
    }
  },
  // Add some successful logs for variety
  {
    id: 'success-1',
    timestamp: new Date('2025-06-24T18:45:22Z'),
    level: 'info',
    message: 'Workflow execution completed successfully',
    source: 'Workflow Engine',
    workflowId: 'workflow-1',
    workflowName: 'Email Agent',
    trigger: 'webhook',
    duration: 1250,
    metadata: {
      executionId: 'success-1',
      blocksExecuted: 5,
      totalDuration: 1250
    }
  },
  {
    id: 'warning-1',
    timestamp: new Date('2025-06-24T18:30:15Z'),
    level: 'warning',
    message: 'API rate limit approaching for external service',
    source: 'API Block',
    workflowId: 'workflow-2',
    workflowName: 'Data Sync',
    blockId: 'api-1',
    blockName: 'External API',
    trigger: 'manual',
    duration: 2100,
    metadata: {
      executionId: 'warning-1',
      rateLimitRemaining: 5,
      rateLimitReset: '2025-06-24T19:00:00Z'
    }
  }
];