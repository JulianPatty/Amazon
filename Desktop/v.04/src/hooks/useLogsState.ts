import { useState, useCallback, useMemo } from 'react';
import { LogEntry, LogFilter, LogStats } from '../types/logs';
import { mockLogs } from '../data/mockLogs';

interface UseLogsStateReturn {
  logs: LogEntry[];
  filteredLogs: LogEntry[];
  filter: LogFilter;
  stats: LogStats;
  isLive: boolean;
  searchQuery: string;
  setFilter: (filter: Partial<LogFilter>) => void;
  setSearchQuery: (query: string) => void;
  setIsLive: (live: boolean) => void;
  clearLogs: () => void;
  exportLogs: () => void;
  refreshLogs: () => void;
}

export const useLogsState = (): UseLogsStateReturn => {
  const [logs] = useState<LogEntry[]>(mockLogs);
  const [filter, setFilterState] = useState<LogFilter>({
    timeRange: 'all',
    level: 'all',
    trigger: 'all',
    workflow: 'all',
    folder: 'all'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isLive, setIsLive] = useState(false);

  const setFilter = useCallback((newFilter: Partial<LogFilter>) => {
    setFilterState(prev => ({ ...prev, ...newFilter }));
  }, []);

  const filteredLogs = useMemo(() => {
    let filtered = [...logs];

    // Time range filter
    if (filter.timeRange !== 'all') {
      const now = new Date();
      const timeRanges = {
        '1h': 60 * 60 * 1000,
        '24h': 24 * 60 * 60 * 1000,
        '7d': 7 * 24 * 60 * 60 * 1000,
        '30d': 30 * 24 * 60 * 60 * 1000
      };
      const cutoff = new Date(now.getTime() - timeRanges[filter.timeRange]);
      filtered = filtered.filter(log => log.timestamp >= cutoff);
    }

    // Level filter
    if (filter.level !== 'all') {
      filtered = filtered.filter(log => log.level === filter.level);
    }

    // Trigger filter
    if (filter.trigger !== 'all') {
      filtered = filtered.filter(log => log.trigger === filter.trigger);
    }

    // Workflow filter
    if (filter.workflow !== 'all') {
      filtered = filtered.filter(log => log.workflowId === filter.workflow);
    }

    // Search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(log =>
        log.message.toLowerCase().includes(query) ||
        log.source.toLowerCase().includes(query) ||
        log.workflowName?.toLowerCase().includes(query) ||
        log.blockName?.toLowerCase().includes(query) ||
        log.id.toLowerCase().includes(query)
      );
    }

    // Sort by timestamp (newest first)
    return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [logs, filter, searchQuery]);

  const stats = useMemo((): LogStats => {
    return filteredLogs.reduce(
      (acc, log) => {
        acc.total++;
        acc[log.level]++;
        return acc;
      },
      { total: 0, errors: 0, warnings: 0, info: 0, debug: 0 }
    );
  }, [filteredLogs]);

  const clearLogs = useCallback(() => {
    // In a real app, this would clear logs from the backend
    console.log('Clear logs requested');
  }, []);

  const exportLogs = useCallback(() => {
    // In a real app, this would export logs to a file
    const dataStr = JSON.stringify(filteredLogs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `workflow-logs-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [filteredLogs]);

  const refreshLogs = useCallback(() => {
    // In a real app, this would fetch fresh logs from the backend
    console.log('Refresh logs requested');
  }, []);

  return {
    logs,
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
  };
};