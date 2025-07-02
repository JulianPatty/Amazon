import React, { useCallback, useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  MiniMap,
  ConnectionMode,
  MarkerType,
  ReactFlowProvider
} from 'reactflow';
import 'reactflow/dist/style.css';

import { useWorkflowState } from '../hooks/useWorkflowState';
import { BlockType } from '../types/workflow';
import { StartNode } from './nodes/StartNode';
import { AgentNode } from './nodes/AgentNode';
import { GmailNode } from './nodes/GmailNode';
import { CustomNode } from './nodes/CustomNode';
import { blockTypes } from '../data/blockTypes';

const nodeTypes = {
  start: StartNode,
  agent: AgentNode,
  gmail: GmailNode,
  api: CustomNode,
  condition: CustomNode,
  function: CustomNode,
  router: CustomNode,
  memory: CustomNode,
  knowledge: CustomNode,
  workflow: CustomNode,
  response: CustomNode,
  loop: CustomNode,
  transform: CustomNode,
  filter: CustomNode,
  aggregate: CustomNode,
  input: CustomNode,
  output: CustomNode,
  notification: CustomNode,
  database: CustomNode,
  webhook: CustomNode,
  delay: CustomNode
};

interface WorkflowCanvasProps {
  onBlockDrop?: (blockType: BlockType, position: { x: number; y: number }) => void;
}

const WorkflowCanvasInner: React.FC<WorkflowCanvasProps> = ({ onBlockDrop }) => {
  const { 
    currentWorkflow, 
    currentWorkflowId, 
    updateWorkflow, 
    addBlock, 
    updateBlock, 
    deleteBlock,
    addConnection,
    deleteConnection
  } = useWorkflowState();

  // Convert workflow blocks to ReactFlow nodes
  const initialNodes: Node[] = useMemo(() => {
    if (!currentWorkflow) return [];
    
    return currentWorkflow.blocks.map(block => ({
      id: block.id,
      type: block.type,
      position: block.position,
      data: block.data,
      // Make start node non-deletable
      deletable: block.type !== BlockType.START
    }));
  }, [currentWorkflow]);

  // Convert workflow connections to ReactFlow edges
  const initialEdges: Edge[] = useMemo(() => {
    if (!currentWorkflow) return [];
    
    return currentWorkflow.connections.map(connection => ({
      id: connection.id,
      source: connection.source,
      target: connection.target,
      sourceHandle: connection.sourceHandle,
      targetHandle: connection.targetHandle,
      type: 'smoothstep',
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: '#6b7280'
      },
      style: {
        stroke: '#6b7280',
        strokeWidth: 2
      }
    }));
  }, [currentWorkflow]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update local state when workflow changes
  React.useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  // Handle node position changes
  const handleNodesChange = useCallback((changes: any[]) => {
    onNodesChange(changes);
    
    // Update block positions in workflow state
    if (currentWorkflowId) {
      changes.forEach(change => {
        if (change.type === 'position' && change.position) {
          updateBlock(currentWorkflowId, change.id, {
            position: change.position
          });
        }
      });
    }
  }, [onNodesChange, currentWorkflowId, updateBlock]);

  // Handle new connections
  const onConnect = useCallback((connection: Connection) => {
    if (currentWorkflowId && connection.source && connection.target) {
      addConnection(currentWorkflowId, {
        source: connection.source,
        target: connection.target,
        sourceHandle: connection.sourceHandle || undefined,
        targetHandle: connection.targetHandle || undefined
      });
    }
    
    setEdges((eds) => addEdge({
      ...connection,
      type: 'smoothstep',
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: '#6b7280'
      },
      style: {
        stroke: '#6b7280',
        strokeWidth: 2
      }
    }, eds));
  }, [currentWorkflowId, addConnection, setEdges]);

  // Handle drag and drop
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();

    const reactFlowBounds = (event.target as Element).getBoundingClientRect();
    const blockType = event.dataTransfer.getData('application/reactflow') as BlockType;
    const toolConfigData = event.dataTransfer.getData('application/tool-config');

    if (!blockType || !currentWorkflowId) return;

    const position = {
      x: event.clientX - reactFlowBounds.left - 100,
      y: event.clientY - reactFlowBounds.top - 50,
    };

    let blockData: any = {};
    let nodeType = blockType;

    // Check if this is a tool being dropped
    if (toolConfigData) {
      try {
        const toolConfig = JSON.parse(toolConfigData);
        
        // Special handling for Gmail tool
        if (toolConfig.toolId === 'gmail') {
          nodeType = 'gmail' as BlockType;
          blockData = {
            label: 'Gmail 1',
            description: 'Send Gmail',
            config: {
              toolId: toolConfig.toolId,
              toolName: toolConfig.toolName,
              toolCategory: toolConfig.toolCategory,
              isIntegrationTool: true
            }
          };
        } else {
          blockData = {
            label: toolConfig.toolName,
            description: toolConfig.toolDescription,
            config: {
              toolId: toolConfig.toolId,
              toolName: toolConfig.toolName,
              toolCategory: toolConfig.toolCategory,
              isIntegrationTool: true
            }
          };
        }
      } catch (error) {
        console.error('Failed to parse tool config:', error);
      }
    }

    // Fallback to block definition if no tool config
    if (!blockData.label) {
      const blockDef = blockTypes.find(b => b.type === blockType);
      if (!blockDef) return;
      
      blockData = {
        label: blockDef.name,
        description: blockDef.description
      };
    }

    addBlock(currentWorkflowId, {
      type: nodeType,
      position,
      data: blockData
    });

    onBlockDrop?.(blockType, position);
  }, [currentWorkflowId, addBlock, onBlockDrop]);

  // Handle node deletion - prevent start node deletion
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    if (event.detail === 2) { // Double click
      if (currentWorkflowId && node.id !== 'start-node' && node.type !== BlockType.START) {
        deleteBlock(currentWorkflowId, node.id);
      }
    }
  }, [currentWorkflowId, deleteBlock]);

  // Handle edge deletion
  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    if (event.detail === 2) { // Double click
      if (currentWorkflowId) {
        deleteConnection(currentWorkflowId, edge.id);
      }
    }
  }, [currentWorkflowId, deleteConnection]);

  // Handle node deletion via keyboard (Delete key)
  const onNodesDelete = useCallback((nodesToDelete: Node[]) => {
    if (!currentWorkflowId) return;
    
    // Filter out start nodes from deletion
    const deletableNodes = nodesToDelete.filter(node => 
      node.type !== BlockType.START && node.id !== 'start-node'
    );
    
    deletableNodes.forEach(node => {
      deleteBlock(currentWorkflowId, node.id);
    });
  }, [currentWorkflowId, deleteBlock]);

  if (!currentWorkflow) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Workflow Selected</h3>
          <p className="text-gray-500">Select a workflow from the sidebar to start editing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 relative bg-gray-50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onNodesDelete={onNodesDelete}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        attributionPosition="bottom-left"
        className="bg-gray-50"
        deleteKeyCode={['Delete', 'Backspace']}
      >
        <Background color="#e5e7eb" gap={20} />
        <Controls 
          className="bg-white border border-gray-200 rounded-lg shadow-sm"
          showInteractive={false}
        />
        <MiniMap
          className="bg-white border border-gray-200 rounded-lg shadow-sm"
          nodeColor="#e5e7eb"
          maskColor="rgba(0, 0, 0, 0.1)"
        />
      </ReactFlow>
    </div>
  );
};

export const WorkflowCanvas: React.FC<WorkflowCanvasProps> = (props) => {
  return (
    <ReactFlowProvider>
      <WorkflowCanvasInner {...props} />
    </ReactFlowProvider>
  );
};