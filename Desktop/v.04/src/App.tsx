import React, { useState } from 'react';
import { PrimarySidebar } from './components/PrimarySidebar';
import { SecondarySidebar } from './components/SecondarySidebar';
import { WorkflowCanvas } from './components/WorkflowCanvas';
import { LogsPage } from './components/LogsPage';
import { SettingsDialog } from './components/dialogs/SettingsDialog';
import { TopBar } from './components/TopBar';
import { BlockType } from './types/workflow';

type CurrentView = 'workflow' | 'logs' | 'knowledge' | 'settings';

function App() {
  const [primarySidebarCollapsed, setPrimarySidebarCollapsed] = useState(false);
  const [secondarySidebarCollapsed, setSecondarySidebarCollapsed] = useState(false);
  const [currentView, setCurrentView] = useState<CurrentView>('workflow');

  const handleBlockDragStart = (blockType: BlockType) => {
    // Optional: Handle drag start event
    console.log('Dragging block:', blockType);
  };

  const handleBlockDrop = (blockType: BlockType, position: { x: number; y: number }) => {
    // Optional: Handle block drop event
    console.log('Dropped block:', blockType, 'at position:', position);
  };

  const handleViewChange = (view: CurrentView) => {
    setCurrentView(view);
  };

  const renderMainContent = () => {
    switch (currentView) {
      case 'logs':
        return <LogsPage />;
      case 'knowledge':
        return (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Knowledge Base</h3>
              <p className="text-gray-500">Knowledge management coming soon</p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Settings</h3>
              <p className="text-gray-500 mb-4">Configure your workflow editor preferences</p>
              <SettingsDialog>
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Open Settings
                </button>
              </SettingsDialog>
            </div>
          </div>
        );
      case 'workflow':
      default:
        return (
          <>
            <SecondarySidebar
              isCollapsed={secondarySidebarCollapsed}
              onToggle={() => setSecondarySidebarCollapsed(!secondarySidebarCollapsed)}
              onBlockDragStart={handleBlockDragStart}
            />
            <WorkflowCanvas onBlockDrop={handleBlockDrop} />
          </>
        );
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <TopBar />
      
      <div className="flex-1 flex overflow-hidden">
        <PrimarySidebar
          isCollapsed={primarySidebarCollapsed}
          onToggle={() => setPrimarySidebarCollapsed(!primarySidebarCollapsed)}
          currentView={currentView}
          onViewChange={handleViewChange}
        />
        
        <div 
          className="flex-1 flex overflow-hidden"
          style={{ 
            marginLeft: primarySidebarCollapsed ? '48px' : '256px' 
          }}
        >
          {renderMainContent()}
        </div>
      </div>
    </div>
  );
}

export default App;