import React from 'react';
import { 
  Save, 
  Play, 
  Undo2, 
  Redo2, 
  Download,
  Search,
  Settings,
  Maximize
} from 'lucide-react';
import { useWorkflowState } from '../hooks/useWorkflowState';
import { Button } from './ui/Button';
import { Tooltip } from './ui/Tooltip';

export const TopBar: React.FC = () => {
  const { 
    currentWorkflow, 
    canUndo, 
    canRedo, 
    undo, 
    redo 
  } = useWorkflowState();

  return (
    <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-purple-600 rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-sm">W</span>
          </div>
          <div>
            <h1 className="font-semibold text-gray-900">
              {currentWorkflow?.name || 'Workflow'}
            </h1>
            <p className="text-xs text-gray-500">
              Saved less than a minute ago
            </p>
          </div>
        </div>
      </div>

      {/* Center Section */}
      <div className="flex items-center space-x-2">
        <Tooltip content="Undo">
          <Button
            variant="ghost"
            size="sm"
            onClick={undo}
            disabled={!canUndo}
            className="w-8 h-8 p-0"
          >
            <Undo2 className="h-4 w-4" />
          </Button>
        </Tooltip>
        
        <Tooltip content="Redo">
          <Button
            variant="ghost"
            size="sm"
            onClick={redo}
            disabled={!canRedo}
            className="w-8 h-8 p-0"
          >
            <Redo2 className="h-4 w-4" />
          </Button>
        </Tooltip>

        <div className="w-px h-6 bg-gray-200 mx-2" />

        <Tooltip content="Search">
          <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
            <Search className="h-4 w-4" />
          </Button>
        </Tooltip>

        <Tooltip content="Zoom to fit">
          <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
            <Maximize className="h-4 w-4" />
          </Button>
        </Tooltip>

        <Tooltip content="Settings">
          <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
            <Settings className="h-4 w-4" />
          </Button>
        </Tooltip>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-3">
        <Tooltip content="Save workflow">
          <Button variant="outline" size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </Tooltip>

        <Tooltip content="Export workflow">
          <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
            <Download className="h-4 w-4" />
          </Button>
        </Tooltip>

        <Tooltip content="Run workflow">
          <Button size="sm">
            <Play className="h-4 w-4 mr-2" />
            Run
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};