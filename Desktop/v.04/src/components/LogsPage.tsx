import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  Trash2, 
  Play, 
  Pause,
  ChevronDown,
  AlertCircle,
  AlertTriangle,
  Info,
  Bug,
  Clock,
  User,
  Zap,
  Calendar,
  ExternalLink,
  ChevronRight,
  X,
  Copy
} from 'lucide-react';
import { useLogsState } from '../hooks/useLogsState';
import { LogEntry, LogFilter } from '../types/logs';
import { Button } from './ui/Button';
import { ScrollArea } from './ui/ScrollArea';
import { Select } from './ui/DropdownMenu';
import { cn } from '../utils/cn';

export const LogsPage: React.FC = () => {
  const {
    filteredLogs,
    filter,
    stats,
    isLive,
    searchQuery,
    setFilter,
    setSearchQuery,
    setIsLive,
    clearLogs,
    exportLogs,
    refreshLogs
  } = useLogsState();

  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);

  const getLevelIcon = (level: LogEntry['level']) => {
    switch (level) {
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'debug':
        return <Bug className="h-4 w-4 text-gray-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getLevelBadge = (level: LogEntry['level']) => {
    const baseClasses = "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium";
    switch (level) {
      case 'error':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'warning':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'info':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'debug':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getTriggerIcon = (trigger?: string) => {
    switch (trigger) {
      case 'manual':
        return <User className="h-3 w-3" />;
      case 'webhook':
        return <Zap className="h-3 w-3" />;
      case 'schedule':
        return <Calendar className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    
    if (diff < 60000) { // Less than 1 minute
      return 'Just now';
    } else if (diff < 3600000) { // Less than 1 hour
      const minutes = Math.floor(diff / 60000);
      return `${minutes}m ago`;
    } else if (diff < 86400000) { // Less than 1 day
      const hours = Math.floor(diff / 3600000);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(diff / 86400000);
      return `${days}d ago`;
    }
  };

  const formatDuration = (duration?: number) => {
    if (!duration) return 'N/A';
    if (duration < 1000) return `${duration}ms`;
    return `${(duration / 1000).toFixed(2)}s`;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const timeRangeOptions = [
    { value: 'all', label: 'All time' },
    { value: '1h', label: 'Last hour' },
    { value: '24h', label: 'Last 24 hours' },
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' }
  ];

  const levelOptions = [
    { value: 'all', label: 'Any status' },
    { value: 'error', label: 'Error' },
    { value: 'warning', label: 'Warning' },
    { value: 'info', label: 'Info' },
    { value: 'debug', label: 'Debug' }
  ];

  const triggerOptions = [
    { value: 'all', label: 'All triggers' },
    { value: 'manual', label: 'Manual' },
    { value: 'webhook', label: 'Webhook' },
    { value: 'schedule', label: 'Schedule' }
  ];

  const workflowOptions = [
    { value: 'all', label: 'All workflows' },
    { value: 'workflow-0', label: 'Workflow 0' },
    { value: 'workflow-1', label: 'Email Agent' },
    { value: 'workflow-2', label: 'Data Sync' }
  ];

  const folderOptions = [
    { value: 'all', label: 'All folders' },
    { value: 'main-folder', label: 'Workflow Folder' },
    { value: 'additional-workflows', label: 'Additional Workflows' }
  ];

  return (
    <div className="flex-1 flex bg-gray-50 overflow-hidden">
      {/* Main Logs Panel */}
      <div className={cn(
        "flex flex-col bg-gray-50 overflow-hidden transition-all duration-300",
        selectedLog ? "flex-1" : "w-full"
      )}>
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-semibold text-gray-900">Logs</h1>
              <div className="flex items-center space-x-2">
                <Button
                  variant={isLive ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsLive(!isLive)}
                  className="flex items-center"
                >
                  {isLive ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                  {isLive ? 'Live' : 'Paused'}
                </Button>
                <Button variant="outline" size="sm" onClick={refreshLogs}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" onClick={exportLogs}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={clearLogs}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center space-x-6 mb-4">
            <div className="text-sm text-gray-600">
              Showing <span className="font-medium">{filteredLogs.length}</span> logs
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600">{stats.errors} errors</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-600">{stats.warnings} warnings</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">{stats.info} info</span>
              </div>
            </div>
            <div className="text-sm text-gray-500">End of logs</div>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Select
                options={timeRangeOptions}
                value={filter.timeRange}
                onValueChange={(value) => setFilter({ timeRange: value as LogFilter['timeRange'] })}
                placeholder="Time range"
                className="w-32"
              />
              <Select
                options={levelOptions}
                value={filter.level}
                onValueChange={(value) => setFilter({ level: value as LogFilter['level'] })}
                placeholder="Level"
                className="w-32"
              />
              <Select
                options={triggerOptions}
                value={filter.trigger}
                onValueChange={(value) => setFilter({ trigger: value as LogFilter['trigger'] })}
                placeholder="Trigger"
                className="w-32"
              />
              <Select
                options={workflowOptions}
                value={filter.workflow}
                onValueChange={(value) => setFilter({ workflow: value })}
                placeholder="Workflow"
                className="w-40"
              />
              <Select
                options={folderOptions}
                value={filter.folder}
                onValueChange={(value) => setFilter({ folder: value })}
                placeholder="Folder"
                className="w-40"
              />
            </div>
          </div>
        </div>

        {/* Logs Table */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="bg-white">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-gray-200 bg-gray-50 text-sm font-medium text-gray-700">
                <div className="col-span-2">Time</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-2">Workflow</div>
                <div className="col-span-1">ID</div>
                <div className="col-span-1">Trigger</div>
                <div className="col-span-4">Message</div>
                <div className="col-span-1">Duration</div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-200">
                {filteredLogs.map((log) => (
                  <div 
                    key={log.id} 
                    className={cn(
                      "hover:bg-gray-50 transition-colors cursor-pointer",
                      selectedLog?.id === log.id && "bg-blue-50 border-l-4 border-blue-500"
                    )}
                    onClick={() => setSelectedLog(log)}
                  >
                    <div className="grid grid-cols-12 gap-4 px-6 py-4">
                      <div className="col-span-2 text-sm">
                        <div className="font-medium text-gray-900">
                          {log.timestamp.toLocaleTimeString()}
                        </div>
                        <div className="text-gray-500 text-xs">
                          {formatTimestamp(log.timestamp)}
                        </div>
                      </div>
                      
                      <div className="col-span-1">
                        <span className={getLevelBadge(log.level)}>
                          {log.level}
                        </span>
                      </div>
                      
                      <div className="col-span-2 text-sm">
                        <div className="font-medium text-purple-600">
                          {log.workflowName || 'Unknown'}
                        </div>
                      </div>
                      
                      <div className="col-span-1 text-sm font-mono text-gray-600">
                        #{log.id}
                      </div>
                      
                      <div className="col-span-1">
                        <div className="flex items-center space-x-1">
                          <div className="w-4 h-4 bg-green-100 rounded-sm flex items-center justify-center">
                            {getTriggerIcon(log.trigger)}
                          </div>
                          <span className="text-xs text-green-700 capitalize">
                            {log.trigger || 'unknown'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="col-span-4 text-sm">
                        <div className="flex items-center space-x-2">
                          {getLevelIcon(log.level)}
                          <span className="text-gray-900 truncate">
                            {log.message}
                          </span>
                        </div>
                      </div>
                      
                      <div className="col-span-1 text-sm text-gray-600">
                        {formatDuration(log.duration)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {filteredLogs.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No logs found</h3>
                  <p className="text-gray-500 mb-4">
                    Try adjusting your search criteria or time range
                  </p>
                  <Button variant="outline" onClick={() => {
                    setSearchQuery('');
                    setFilter({
                      timeRange: 'all',
                      level: 'all',
                      trigger: 'all',
                      workflow: 'all',
                      folder: 'all'
                    });
                  }}>
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Log Details Side Panel */}
      {selectedLog && (
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
          {/* Panel Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Log Details</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedLog(null)}
              className="w-8 h-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Panel Content */}
          <ScrollArea className="flex-1">
            <div className="p-6 space-y-6">
              {/* Timestamp */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timestamp
                </label>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <span className="text-sm text-gray-900 font-mono">
                    {selectedLog.timestamp.toLocaleString()}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(selectedLog.timestamp.toISOString())}
                    className="w-8 h-8 p-0"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Execution ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Execution ID
                </label>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <span className="text-sm text-gray-900 font-mono">
                    {selectedLog.metadata?.executionId || selectedLog.id}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(selectedLog.metadata?.executionId || selectedLog.id)}
                    className="w-8 h-8 p-0"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <div className="p-3 bg-gray-50 rounded-md">
                  <span className={getLevelBadge(selectedLog.level)}>
                    {selectedLog.level.charAt(0).toUpperCase() + selectedLog.level.slice(1)}
                  </span>
                </div>
              </div>

              {/* Workflow */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Workflow
                </label>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <span className="text-sm text-purple-600 font-medium">
                    {selectedLog.workflowName || 'Unknown'}
                  </span>
                  {selectedLog.workflowId && (
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  )}
                </div>
              </div>

              {/* Trigger */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trigger
                </label>
                <div className="p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-100 rounded-sm flex items-center justify-center">
                      {getTriggerIcon(selectedLog.trigger)}
                    </div>
                    <span className="text-sm text-green-700 capitalize">
                      {selectedLog.trigger || 'unknown'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration
                </label>
                <div className="p-3 bg-gray-50 rounded-md">
                  <span className="text-sm text-gray-900">
                    {formatDuration(selectedLog.duration)}
                  </span>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <div className="p-3 bg-gray-50 rounded-md">
                  <div className="flex items-start space-x-2">
                    {getLevelIcon(selectedLog.level)}
                    <p className="text-sm text-gray-900 whitespace-pre-wrap flex-1">
                      {selectedLog.message}
                    </p>
                  </div>
                </div>
              </div>

              {/* Source */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Source
                </label>
                <div className="p-3 bg-gray-50 rounded-md">
                  <span className="text-sm text-gray-900">
                    {selectedLog.source}
                  </span>
                </div>
              </div>

              {/* Block Information */}
              {selectedLog.blockName && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Block
                  </label>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <span className="text-sm text-gray-900">
                      {selectedLog.blockName}
                    </span>
                    {selectedLog.blockId && (
                      <div className="text-xs text-gray-500 mt-1 font-mono">
                        ID: {selectedLog.blockId}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Metadata */}
              {selectedLog.metadata && Object.keys(selectedLog.metadata).length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Metadata
                  </label>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                      {JSON.stringify(selectedLog.metadata, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {/* Stack Trace */}
              {selectedLog.stackTrace && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stack Trace
                  </label>
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <pre className="text-xs text-red-700 whitespace-pre-wrap">
                      {selectedLog.stackTrace}
                    </pre>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Download className="h-3 w-3 mr-1" />
                    Export Log
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Copy className="h-3 w-3 mr-1" />
                    Copy ID
                  </Button>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};