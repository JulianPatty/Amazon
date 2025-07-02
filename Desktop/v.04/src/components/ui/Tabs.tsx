import React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '../../utils/cn';

// TypeScript interfaces
export interface TabItem {
  value: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface TabsProps {
  items: TabItem[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  children?: React.ReactNode;
  loading?: boolean;
  error?: string | null;
}

// Base Tabs Components
const TabsRoot = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Root
    ref={ref}
    className={cn('w-full', className)}
    {...props}
  />
));
TabsRoot.displayName = 'TabsRoot';

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'inline-flex h-10 items-center justify-start rounded-lg bg-gray-100 p-1 text-gray-500',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
      className
    )}
    {...props}
  />
));
TabsList.displayName = 'TabsList';

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
    icon?: React.ComponentType<{ className?: string }>;
  }
>(({ className, icon: Icon, children, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium',
      'ring-offset-white transition-all duration-200 ease-in-out',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      'data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm',
      'hover:bg-gray-50 hover:text-gray-700',
      'data-[state=active]:hover:bg-white data-[state=active]:hover:text-gray-900',
      className
    )}
    {...props}
  >
    {Icon && <Icon className="mr-2 h-4 w-4" />}
    {children}
  </TabsPrimitive.Trigger>
));
TabsTrigger.displayName = 'TabsTrigger';

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-4 ring-offset-white',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
      'data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:zoom-in-95',
      'data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0 data-[state=inactive]:zoom-out-95',
      'transition-all duration-300 ease-in-out',
      className
    )}
    {...props}
  />
));
TabsContent.displayName = 'TabsContent';

// Loading Component
const TabsLoading: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('flex items-center justify-center p-8', className)}>
    <div className="flex items-center space-x-2">
      <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse" />
      <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse animation-delay-200" />
      <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse animation-delay-400" />
    </div>
  </div>
);

// Error Component
const TabsError: React.FC<{ error: string; className?: string }> = ({ error, className }) => (
  <div className={cn('flex items-center justify-center p-8', className)}>
    <div className="text-center">
      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p className="text-sm text-red-600 font-medium">Error loading content</p>
      <p className="text-xs text-gray-500 mt-1">{error}</p>
    </div>
  </div>
);

// Main Tabs Component
export const Tabs: React.FC<TabsProps> = ({
  items,
  defaultValue,
  value,
  onValueChange,
  orientation = 'horizontal',
  className,
  children,
  loading = false,
  error = null
}) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue || items[0]?.value || '');
  
  const currentValue = value !== undefined ? value : internalValue;
  
  const handleValueChange = React.useCallback((newValue: string) => {
    if (value === undefined) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  }, [value, onValueChange]);

  // Error handling
  if (error) {
    return <TabsError error={error} className={className} />;
  }

  // Loading state
  if (loading) {
    return <TabsLoading className={className} />;
  }

  // Empty state
  if (!items || items.length === 0) {
    return (
      <div className={cn('flex items-center justify-center p-8', className)}>
        <p className="text-sm text-gray-500">No tabs available</p>
      </div>
    );
  }

  return (
    <TabsRoot
      value={currentValue}
      onValueChange={handleValueChange}
      orientation={orientation}
      className={className}
    >
      <TabsList aria-label="Tab navigation">
        {items.map((item) => (
          <TabsTrigger
            key={item.value}
            value={item.value}
            disabled={item.disabled}
            icon={item.icon}
            aria-label={`Switch to ${item.label} tab`}
          >
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {items.map((item) => (
        <TabsContent
          key={item.value}
          value={item.value}
          role="tabpanel"
          aria-labelledby={`tab-${item.value}`}
        >
          {item.content}
        </TabsContent>
      ))}

      {children}
    </TabsRoot>
  );
};

// Export individual components for advanced usage
export {
  TabsRoot,
  TabsList,
  TabsTrigger,
  TabsContent,
  TabsLoading,
  TabsError
};

// Export the primitive for direct access if needed
export { TabsPrimitive };