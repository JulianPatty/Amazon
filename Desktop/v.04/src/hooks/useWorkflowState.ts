import { useState, useCallback, useEffect } from 'react';
import { Workflow, WorkflowBlock, WorkflowConnection, BlockType } from '../types/workflow';

interface WorkflowHistory {
  workflows: Workflow[];
  currentWorkflowId: string | null;
}

interface UseWorkflowStateReturn {
  workflows: Workflow[];
  currentWorkflow: Workflow | null;
  currentWorkflowId: string | null;
  canUndo: boolean;
  canRedo: boolean;
  createWorkflow: (name: string) => void;
  deleteWorkflow: (id: string) => void;
  setCurrentWorkflow: (id: string | null) => void;
  updateWorkflow: (id: string, updates: Partial<Workflow>) => void;
  addBlock: (workflowId: string, block: Omit<WorkflowBlock, 'id'>) => void;
  updateBlock: (workflowId: string, blockId: string, updates: Partial<WorkflowBlock>) => void;
  deleteBlock: (workflowId: string, blockId: string) => void;
  addConnection: (workflowId: string, connection: Omit<WorkflowConnection, 'id'>) => void;
  deleteConnection: (workflowId: string, connectionId: string) => void;
  undo: () => void;
  redo: () => void;
}

const createDefaultWorkflow = (name: string): Workflow => ({
  id: `workflow-${Date.now()}`,
  name,
  blocks: [
    {
      id: 'start-node',
      type: BlockType.START,
      position: { x: 400, y: 200 },
      data: {
        label: 'Start',
        description: 'Start Workflow'
      }
    }
  ],
  connections: [],
  createdAt: new Date(),
  updatedAt: new Date()
});

const STORAGE_KEY = 'workflow-editor-state';
const MAX_HISTORY = 50;

export const useWorkflowState = (): UseWorkflowStateReturn => {
  const [history, setHistory] = useState<WorkflowHistory[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  // Initialize state
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        const initialState: WorkflowHistory = {
          workflows: parsed.workflows || [createDefaultWorkflow('Workflow 0')],
          currentWorkflowId: parsed.currentWorkflowId || null
        };
        setHistory([initialState]);
        setHistoryIndex(0);
      } catch (error) {
        console.error('Failed to parse saved state:', error);
        initializeDefault();
      }
    } else {
      initializeDefault();
    }
  }, []);

  const initializeDefault = () => {
    const defaultWorkflow = createDefaultWorkflow('Workflow 0');
    const initialState: WorkflowHistory = {
      workflows: [defaultWorkflow],
      currentWorkflowId: defaultWorkflow.id
    };
    setHistory([initialState]);
    setHistoryIndex(0);
  };

  // Auto-save with debounce
  useEffect(() => {
    if (historyIndex >= 0 && history[historyIndex]) {
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }
      
      const timeout = setTimeout(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history[historyIndex]));
      }, 1000);
      
      setSaveTimeout(timeout);
    }
  }, [history, historyIndex]);

  const currentState = historyIndex >= 0 ? history[historyIndex] : null;
  const workflows = currentState?.workflows || [];
  const currentWorkflowId = currentState?.currentWorkflowId || null;
  const currentWorkflow = workflows.find(w => w.id === currentWorkflowId) || null;

  const addToHistory = useCallback((newState: WorkflowHistory) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(newState);
      return newHistory.slice(-MAX_HISTORY);
    });
    setHistoryIndex(prev => Math.min(prev + 1, MAX_HISTORY - 1));
  }, [historyIndex]);

  const createWorkflow = useCallback((name: string) => {
    if (!currentState) return;
    
    const newWorkflow = createDefaultWorkflow(name);
    const newState: WorkflowHistory = {
      ...currentState,
      workflows: [...currentState.workflows, newWorkflow],
      currentWorkflowId: newWorkflow.id
    };
    addToHistory(newState);
  }, [currentState, addToHistory]);

  const deleteWorkflow = useCallback((id: string) => {
    if (!currentState) return;
    
    const newWorkflows = currentState.workflows.filter(w => w.id !== id);
    const newCurrentId = currentState.currentWorkflowId === id 
      ? (newWorkflows.length > 0 ? newWorkflows[0].id : null)
      : currentState.currentWorkflowId;
    
    const newState: WorkflowHistory = {
      workflows: newWorkflows,
      currentWorkflowId: newCurrentId
    };
    addToHistory(newState);
  }, [currentState, addToHistory]);

  const setCurrentWorkflow = useCallback((id: string | null) => {
    if (!currentState) return;
    
    const newState: WorkflowHistory = {
      ...currentState,
      currentWorkflowId: id
    };
    addToHistory(newState);
  }, [currentState, addToHistory]);

  const updateWorkflow = useCallback((id: string, updates: Partial<Workflow>) => {
    if (!currentState) return;
    
    const newWorkflows = currentState.workflows.map(w => 
      w.id === id ? { ...w, ...updates, updatedAt: new Date() } : w
    );
    
    const newState: WorkflowHistory = {
      ...currentState,
      workflows: newWorkflows
    };
    addToHistory(newState);
  }, [currentState, addToHistory]);

  const addBlock = useCallback((workflowId: string, block: Omit<WorkflowBlock, 'id'>) => {
    const newBlock: WorkflowBlock = {
      ...block,
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    
    updateWorkflow(workflowId, {
      blocks: [...(currentWorkflow?.blocks || []), newBlock]
    });
  }, [currentWorkflow, updateWorkflow]);

  const updateBlock = useCallback((workflowId: string, blockId: string, updates: Partial<WorkflowBlock>) => {
    if (!currentWorkflow) return;
    
    const newBlocks = currentWorkflow.blocks.map(b => 
      b.id === blockId ? { ...b, ...updates } : b
    );
    
    updateWorkflow(workflowId, { blocks: newBlocks });
  }, [currentWorkflow, updateWorkflow]);

  const deleteBlock = useCallback((workflowId: string, blockId: string) => {
    if (!currentWorkflow) return;
    
    const newBlocks = currentWorkflow.blocks.filter(b => b.id !== blockId);
    const newConnections = currentWorkflow.connections.filter(c => 
      c.source !== blockId && c.target !== blockId
    );
    
    updateWorkflow(workflowId, { 
      blocks: newBlocks, 
      connections: newConnections 
    });
  }, [currentWorkflow, updateWorkflow]);

  const addConnection = useCallback((workflowId: string, connection: Omit<WorkflowConnection, 'id'>) => {
    const newConnection: WorkflowConnection = {
      ...connection,
      id: `connection-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    
    updateWorkflow(workflowId, {
      connections: [...(currentWorkflow?.connections || []), newConnection]
    });
  }, [currentWorkflow, updateWorkflow]);

  const deleteConnection = useCallback((workflowId: string, connectionId: string) => {
    if (!currentWorkflow) return;
    
    const newConnections = currentWorkflow.connections.filter(c => c.id !== connectionId);
    updateWorkflow(workflowId, { connections: newConnections });
  }, [currentWorkflow, updateWorkflow]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
    }
  }, [historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
    }
  }, [historyIndex, history.length]);

  return {
    workflows,
    currentWorkflow,
    currentWorkflowId,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    createWorkflow,
    deleteWorkflow,
    setCurrentWorkflow,
    updateWorkflow,
    addBlock,
    updateBlock,
    deleteBlock,
    addConnection,
    deleteConnection,
    undo,
    redo
  };
};