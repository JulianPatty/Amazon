import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Folder, 
  FileText, 
  Trash2,
  MoreHorizontal,
  User,
  Settings,
  FileStack,
  Brain,
  ChevronDown,
  FolderOpen
} from 'lucide-react';
import { useWorkflowState } from '../hooks/useWorkflowState';
import { SettingsDialog } from './dialogs/SettingsDialog';
import { Button } from './ui/Button';
import { Tooltip } from './ui/Tooltip';
import { ScrollArea } from './ui/ScrollArea';
import { WorkflowContextMenu, FolderContextMenu } from './ui/ContextMenu';

type CurrentView = 'workflow' | 'logs' | 'knowledge' | 'settings';

interface PrimarySidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  currentView: CurrentView;
  onViewChange: (view: CurrentView) => void;
}

// Define workflow colors based on index
const getWorkflowColor = (index: number) => {
  const colors = [
    'bg-green-400',
    'bg-yellow-400', 
    'bg-purple-400',
    'bg-pink-400',
    'bg-blue-400',
    'bg-red-400',
    'bg-indigo-400',
    'bg-orange-400',
    'bg-teal-400',
    'bg-cyan-400'
  ];
  return colors[index % colors.length];
};

export const PrimarySidebar: React.FC<PrimarySidebarProps> = ({ 
  isCollapsed, 
  onToggle,
  currentView,
  onViewChange
}) => {
  const { 
    workflows, 
    currentWorkflowId, 
    createWorkflow, 
    deleteWorkflow, 
    setCurrentWorkflow,
    updateWorkflow
  } = useWorkflowState();
  
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['workflows-root', 'main-folder']));

  const handleCreateWorkflow = () => {
    const name = `Workflow ${workflows.length}`;
    createWorkflow(name);
    onViewChange('workflow'); // Switch to workflow view when creating
  };

  const handleDeleteWorkflow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (workflows.length > 1) {
      deleteWorkflow(id);
    }
  };

  const handleWorkflowClick = (workflowId: string) => {
    setCurrentWorkflow(workflowId);
    onViewChange('workflow'); // Switch to workflow view when selecting
  };

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  // Context menu handlers
  const handleWorkflowRename = (id: string, name: string) => {
    updateWorkflow(id, { name });
  };

  const handleWorkflowDelete = (id: string) => {
    if (workflows.length > 1) {
      deleteWorkflow(id);
    }
  };

  const handleWorkflowDuplicate = (id: string) => {
    const workflow = workflows.find(w => w.id === id);
    if (workflow) {
      createWorkflow(`${workflow.name} (Copy)`);
    }
  };

  const handleWorkflowShare = (id: string) => {
    console.log('Share workflow:', id);
  };

  const handleWorkflowExport = (id: string) => {
    console.log('Export workflow:', id);
  };

  const handleWorkflowArchive = (id: string) => {
    console.log('Archive workflow:', id);
  };

  const handleWorkflowFavorite = (id: string) => {
    console.log('Favorite workflow:', id);
  };

  const handleFolderRename = (id: string, name: string) => {
    console.log('Rename folder:', id, name);
  };

  const handleFolderDelete = (id: string) => {
    console.log('Delete folder:', id);
  };

  const handleCreateWorkflowInFolder = (folderId: string) => {
    const name = `Workflow ${workflows.length}`;
    createWorkflow(name);
  };

  const handleCreateFolder = (parentId: string) => {
    console.log('Create folder in:', parentId);
  };

  const handleFolderSettings = (id: string) => {
    console.log('Folder settings:', id);
  };

  // Get current workflow color
  const getCurrentWorkflowColor = () => {
    if (!currentWorkflowId) return 'bg-gray-400';
    const currentIndex = workflows.findIndex(w => w.id === currentWorkflowId);
    return currentIndex >= 0 ? getWorkflowColor(currentIndex) : 'bg-gray-400';
  };

  // Organize workflows into folders for better visual hierarchy
  const organizedWorkflows = [
    {
      id: 'main-folder',
      name: 'Workflow Folder',
      type: 'folder',
      workflows: workflows.slice(0, 3)
    },
    {
      id: 'additional-workflows',
      name: 'Additional Workflows',
      type: 'folder',
      workflows: workflows.slice(3)
    }
  ];

  if (isCollapsed) {
    return (
      <div className="fixed left-0 top-14 bottom-0 w-12 bg-white border-r border-gray-200 flex flex-col z-40">
        <div className="p-2">
          <Tooltip content="Expand sidebar">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="w-8 h-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Tooltip>
        </div>
        
        <div className="flex-1 flex flex-col items-center py-4 space-y-3">
          <Tooltip content="Create Workflow">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCreateWorkflow}
              className="w-8 h-8 p-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </Tooltip>
          
          <div className="w-6 h-px bg-gray-200" />
          
          {/* Current Workflow Color Indicator */}
          <Tooltip content={`Current Workflow: ${workflows.find(w => w.id === currentWorkflowId)?.name || 'None'}`}>
            <div className={`w-6 h-6 ${getCurrentWorkflowColor()} rounded-md shadow-sm border border-white`} />
          </Tooltip>
          
          <Tooltip content="Workflows">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`w-8 h-8 p-0 ${currentView === 'workflow' ? 'bg-blue-50 text-blue-600' : ''}`}
              onClick={() => onViewChange('workflow')}
            >
              <Folder className="h-4 w-4" />
            </Button>
          </Tooltip>
        </div>
        
        <div className="p-2 space-y-2 border-t border-gray-200">
          <Tooltip content="Logs">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`w-8 h-8 p-0 ${currentView === 'logs' ? 'bg-blue-50 text-blue-600' : ''}`}
              onClick={() => onViewChange('logs')}
            >
              <FileStack className="h-4 w-4" />
            </Button>
          </Tooltip>
          <Tooltip content="Knowledge">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`w-8 h-8 p-0 ${currentView === 'knowledge' ? 'bg-blue-50 text-blue-600' : ''}`}
              onClick={() => onViewChange('knowledge')}
            >
              <Brain className="h-4 w-4" />
            </Button>
          </Tooltip>
          <Tooltip content="Settings">
            <SettingsDialog>
              <Button 
                variant="ghost" 
                size="sm" 
                className={`w-8 h-8 p-0 ${currentView === 'settings' ? 'bg-blue-50 text-blue-600' : ''}`}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </SettingsDialog>
          </Tooltip>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed left-0 top-14 bottom-0 w-64 bg-white border-r border-gray-200 flex flex-col z-40">
      {/* Header - Fixed */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Workflows</h2>
          <Tooltip content="Collapse Menu">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="w-8 h-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Tooltip>
        </div>
        
        <Button
          onClick={handleCreateWorkflow}
          className="w-full justify-start"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create a Workflow
        </Button>
      </div>

      {/* Workflows List with Folder Structure - Scrollable */}
      {currentView === 'workflow' && (
        <ScrollArea className="flex-1">
          <div className="p-2">
            {/* Root Workflows Section */}
            <div className="mb-3">
              <button
                onClick={() => toggleFolder('workflows-root')}
                className="flex items-center w-full px-2 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
                aria-expanded={expandedFolders.has('workflows-root')}
                aria-label="Toggle workflows folder"
              >
                <ChevronDown 
                  className={`h-4 w-4 mr-1 transition-transform duration-200 ${
                    expandedFolders.has('workflows-root') ? 'rotate-0' : '-rotate-90'
                  }`} 
                />
                <Folder className="h-4 w-4 mr-2" />
                Workflows
              </button>
            </div>
            
            {/* Folder Contents - Only show when expanded */}
            {expandedFolders.has('workflows-root') && (
              <div className="space-y-1 ml-4">
                {organizedWorkflows.map((folder) => (
                  <div key={folder.id}>
                    {/* Folder Header with Context Menu */}
                    <div className="flex items-center justify-between group">
                      <FolderContextMenu
                        folderId={folder.id}
                        folderName={folder.name}
                        onRename={handleFolderRename}
                        onDelete={handleFolderDelete}
                        onCreateWorkflow={handleCreateWorkflowInFolder}
                        onCreateFolder={handleCreateFolder}
                        onSettings={handleFolderSettings}
                      >
                        <button
                          onClick={() => toggleFolder(folder.id)}
                          className="flex items-center px-2 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md flex-1 transition-colors duration-150"
                          aria-expanded={expandedFolders.has(folder.id)}
                          aria-label={`Toggle ${folder.name} folder`}
                        >
                          <ChevronDown 
                            className={`h-3 w-3 mr-2 transition-transform duration-200 ${
                              expandedFolders.has(folder.id) ? 'rotate-0' : '-rotate-90'
                            }`} 
                          />
                          {expandedFolders.has(folder.id) ? (
                            <FolderOpen className="h-4 w-4 mr-2 text-blue-500" />
                          ) : (
                            <Folder className="h-4 w-4 mr-2 text-gray-500" />
                          )}
                          <span className="truncate">{folder.name}</span>
                          <span className="ml-auto text-xs text-gray-400">
                            {folder.workflows.length}
                          </span>
                        </button>
                      </FolderContextMenu>
                    </div>

                    {/* Folder Contents */}
                    {expandedFolders.has(folder.id) && folder.workflows.length > 0 && (
                      <div className="ml-6 space-y-1 mt-1">
                        {folder.workflows.map((workflow, index) => {
                          const globalIndex = workflows.findIndex(w => w.id === workflow.id);
                          const workflowColor = getWorkflowColor(globalIndex);
                          
                          return (
                            <WorkflowContextMenu
                              key={workflow.id}
                              workflowId={workflow.id}
                              workflowName={workflow.name}
                              onRename={handleWorkflowRename}
                              onDelete={handleWorkflowDelete}
                              onDuplicate={handleWorkflowDuplicate}
                              onShare={handleWorkflowShare}
                              onExport={handleWorkflowExport}
                              onArchive={handleWorkflowArchive}
                              onFavorite={handleWorkflowFavorite}
                            >
                              <div
                                className={`group flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-all duration-150 ${
                                  currentWorkflowId === workflow.id
                                    ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-500 shadow-sm'
                                    : 'text-gray-700 hover:bg-gray-50'
                                }`}
                                onClick={() => handleWorkflowClick(workflow.id)}
                              >
                                <div className="flex items-center min-w-0 flex-1">
                                  <div className={`w-2.5 h-2.5 rounded-full mr-3 ${workflowColor}`} />
                                  <span className="truncate text-sm font-medium">
                                    {workflow.name === 'Workflow 0' && index === 2 ? 'Workflow 0' :
                                     workflow.name === 'Workflow 1' && index === 1 ? 'Workflow 1' :
                                     workflow.name === 'Workflow 2' && index === 4 ? 'Workflow 2' :
                                     index === 0 ? 'Workflow 3' :
                                     index === 3 ? 'Email Agent' :
                                     workflow.name}
                                  </span>
                                </div>
                                
                                {workflows.length > 1 && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => handleDeleteWorkflow(workflow.id, e)}
                                    className="opacity-0 group-hover:opacity-100 w-6 h-6 p-0 transition-opacity duration-150"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                            </WorkflowContextMenu>
                          );
                        })}
                      </div>
                    )}

                    {/* Empty folder state */}
                    {expandedFolders.has(folder.id) && folder.workflows.length === 0 && (
                      <div className="ml-6 py-2 text-xs text-gray-400 italic">
                        No workflows in this folder
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      )}

      {/* Footer - Fixed */}
      <div className="p-4 border-t border-gray-200 space-y-2 flex-shrink-0">
        <div className="flex justify-start">
          <Button 
            variant="ghost" 
            className={`w-3/4 text-left pl-2 justify-between ${currentView === 'logs' ? 'bg-blue-50 text-blue-600' : ''}`}
            size="sm"
            onClick={() => onViewChange('logs')}
          >
            <span>Logs</span>
            <FileStack className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex justify-start">
          <Button 
            variant="ghost" 
            className={`w-3/4 text-left pl-2 justify-between ${currentView === 'knowledge' ? 'bg-blue-50 text-blue-600' : ''}`}
            size="sm"
            onClick={() => onViewChange('knowledge')}
          >
            <span>Knowledge</span>
            <Brain className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex justify-start">
          <SettingsDialog>
            <Button 
              variant="ghost" 
              className={`w-3/4 text-left pl-2 justify-between ${currentView === 'settings' ? 'bg-blue-50 text-blue-600' : ''}`}
              size="sm"
            >
              <span>Settings</span>
              <Settings className="h-4 w-4" />
            </Button>
          </SettingsDialog>
        </div>
        
        <div className="pt-2 border-t border-gray-200">
          <div className="flex items-center px-2 py-1">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-medium mr-2">
              JP
            </div>
            <span className="text-sm text-gray-700">Julian Patrick</span>
          </div>
        </div>
      </div>
    </div>
  );
};