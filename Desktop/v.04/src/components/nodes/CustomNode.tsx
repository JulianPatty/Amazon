import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import * as LucideIcons from 'lucide-react';
import { WorkflowBlockData, BlockType } from '../../types/workflow';
import { blockTypes } from '../../data/blockTypes';

interface CustomNodeData extends WorkflowBlockData {}

export const CustomNode: React.FC<NodeProps<CustomNodeData>> = ({ 
  data, 
  selected,
  type 
}) => {
  const blockType = blockTypes.find(b => b.type === type as BlockType);
  if (!blockType) return null;

  const getIconComponent = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent ? <IconComponent className="h-4 w-4 text-white" /> : <LucideIcons.Square className="h-4 w-4 text-white" />;
  };

  return (
    <div className={`bg-white rounded-lg border-2 shadow-sm min-w-[200px] ${
      selected ? 'border-blue-500' : 'border-gray-200'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-t-lg border-b border-gray-200">
        <div className="flex items-center">
          <div className={`w-8 h-8 ${blockType.color} rounded-md flex items-center justify-center mr-3`}>
            {getIconComponent(blockType.icon)}
          </div>
          <div>
            <div className="font-medium text-gray-900">{blockType.name}</div>
            <div className="text-xs text-gray-500">{blockType.description}</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="text-sm text-gray-600">
          Configure {blockType.name.toLowerCase()} settings
        </div>
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