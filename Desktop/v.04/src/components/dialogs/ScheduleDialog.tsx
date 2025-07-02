import React, { useState } from 'react';
import { X, Clock, Calendar, ChevronDown } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '../ui/Dialog';
import { Button } from '../ui/Button';
import { Select } from '../ui/DropdownMenu';

interface ScheduleDialogProps {
  children: React.ReactNode;
  onSave?: (config: ScheduleConfig) => void;
}

interface ScheduleConfig {
  startDate: string;
  startTime: string;
  frequency: string;
  timeOfDay: string;
  timezone: string;
}

export const ScheduleDialog: React.FC<ScheduleDialogProps> = ({
  children,
  onSave
}) => {
  const [open, setOpen] = useState(false);
  const [config, setConfig] = useState<ScheduleConfig>({
    startDate: '',
    startTime: '',
    frequency: 'daily',
    timeOfDay: '',
    timezone: 'UTC'
  });

  const frequencyOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'hourly', label: 'Hourly' },
    { value: 'custom', label: 'Custom' }
  ];

  const timezoneOptions = [
    { value: 'UTC', label: 'UTC' },
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
    { value: 'Europe/Paris', label: 'Central European Time (CET)' },
    { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)' },
    { value: 'Asia/Shanghai', label: 'China Standard Time (CST)' },
    { value: 'Australia/Sydney', label: 'Australian Eastern Time (AET)' }
  ];

  const handleSave = () => {
    onSave?.(config);
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const formatTimeForInput = (date: Date) => {
    return date.toTimeString().slice(0, 5);
  };

  const getCurrentDate = () => {
    return formatDateForInput(new Date());
  };

  const getCurrentTime = () => {
    return formatTimeForInput(new Date());
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      <DialogContent size="lg" className="max-w-2xl" showCloseButton={false}>
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Schedule Configuration
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="w-8 h-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-6">
          {/* Start At and Time Row */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">
                Start At
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={config.startDate}
                  onChange={(e) => setConfig(prev => ({ ...prev, startDate: e.target.value }))}
                  min={getCurrentDate()}
                  className="w-full px-3 py-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-500"
                  placeholder="Select date"
                />
                {!config.startDate && (
                  <div className="absolute inset-0 flex items-center px-3 pointer-events-none">
                    <span className="text-gray-500 text-sm">Select date</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">
                Time
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="time"
                  value={config.startTime}
                  onChange={(e) => setConfig(prev => ({ ...prev, startTime: e.target.value }))}
                  className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-500"
                  placeholder="Select time"
                />
                {!config.startTime && (
                  <div className="absolute inset-0 flex items-center pl-10 pointer-events-none">
                    <span className="text-gray-500 text-sm">Select time</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Frequency */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900">
              Frequency
            </label>
            <Select
              options={frequencyOptions}
              value={config.frequency}
              onValueChange={(value) => setConfig(prev => ({ ...prev, frequency: value }))}
              placeholder="Select frequency"
              className="w-full"
            />
          </div>

          {/* Time of Day */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900">
              Time of Day
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="time"
                value={config.timeOfDay}
                onChange={(e) => setConfig(prev => ({ ...prev, timeOfDay: e.target.value }))}
                className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-500"
                placeholder="Select time"
              />
              {!config.timeOfDay && (
                <div className="absolute inset-0 flex items-center pl-10 pointer-events-none">
                  <span className="text-gray-500 text-sm">Select time</span>
                </div>
              )}
            </div>
          </div>

          {/* Timezone */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900">
              Timezone
            </label>
            <Select
              options={timezoneOptions}
              value={config.timezone}
              onValueChange={(value) => setConfig(prev => ({ ...prev, timezone: value }))}
              placeholder="Select timezone"
              className="w-full"
            />
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            className="bg-gray-600 hover:bg-gray-700 text-white"
          >
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};