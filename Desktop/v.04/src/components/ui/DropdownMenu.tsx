import React from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { Check, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';

// TypeScript interfaces
export interface DropdownMenuItem {
  value: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
  separator?: boolean;
}

export interface DropdownMenuProps {
  items: DropdownMenuItem[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  contentClassName?: string;
  triggerClassName?: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  children?: React.ReactNode;
}

// Base Dropdown Menu Components
const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'z-50 min-w-[220px] overflow-hidden rounded-lg border border-gray-200 bg-white p-1 shadow-lg',
        'animate-in data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
        'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        'transition-all duration-200 ease-out',
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = 'DropdownMenuContent';

const DropdownMenuTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.Trigger
    ref={ref}
    className={cn(
      'flex h-10 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm',
      'ring-offset-white placeholder:text-gray-500',
      'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'hover:bg-gray-50 transition-colors duration-150',
      'data-[state=open]:ring-2 data-[state=open]:ring-blue-500 data-[state=open]:ring-offset-2',
      className
    )}
    {...props}
  >
    {children}
    <ChevronDown className="h-4 w-4 opacity-50 transition-transform duration-200 data-[state=open]:rotate-180" />
  </DropdownMenuPrimitive.Trigger>
));
DropdownMenuTrigger.displayName = 'DropdownMenuTrigger';

const DropdownMenuItemComponent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    icon?: React.ComponentType<{ className?: string }>;
    selected?: boolean;
  }
>(({ className, icon: Icon, selected, children, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex cursor-pointer select-none items-center rounded-md px-3 py-2 text-sm outline-none',
      'transition-colors duration-150 focus:bg-gray-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      'hover:bg-gray-50 focus:bg-gray-100',
      selected && 'bg-blue-50 text-blue-700',
      className
    )}
    {...props}
  >
    {Icon && <Icon className="mr-3 h-4 w-4" />}
    <span className="flex-1">{children}</span>
    {selected && <Check className="ml-auto h-4 w-4 text-blue-600" />}
  </DropdownMenuPrimitive.Item>
));
DropdownMenuItemComponent.displayName = 'DropdownMenuItemComponent';

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn('mx-2 my-1 h-px bg-gray-200', className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = 'DropdownMenuSeparator';

// Main Dropdown Menu Component
export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  items,
  value,
  onValueChange,
  placeholder = 'Select an option...',
  disabled = false,
  className,
  contentClassName,
  triggerClassName,
  side = 'bottom',
  align = 'start',
  sideOffset = 4,
  children
}) => {
  const [open, setOpen] = React.useState(false);
  const selectedItem = items.find(item => item.value === value);

  const handleItemSelect = (itemValue: string) => {
    onValueChange?.(itemValue);
    setOpen(false);
  };

  return (
    <DropdownMenuPrimitive.Root open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        disabled={disabled}
        className={cn(triggerClassName)}
        aria-label={placeholder}
      >
        <span className={cn(
          'truncate',
          !selectedItem && 'text-gray-500'
        )}>
          {selectedItem ? (
            <span className="flex items-center">
              {selectedItem.icon && (
                <selectedItem.icon className="mr-2 h-4 w-4" />
              )}
              {selectedItem.label}
            </span>
          ) : (
            placeholder
          )}
        </span>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side={side}
        align={align}
        sideOffset={sideOffset}
        className={cn(contentClassName)}
      >
        {items.map((item, index) => (
          <React.Fragment key={item.value}>
            {item.separator && index > 0 && <DropdownMenuSeparator />}
            <DropdownMenuItemComponent
              disabled={item.disabled}
              icon={item.icon}
              selected={value === item.value}
              onClick={() => handleItemSelect(item.value)}
              onSelect={() => handleItemSelect(item.value)}
            >
              {item.label}
            </DropdownMenuItemComponent>
          </React.Fragment>
        ))}
        {children}
      </DropdownMenuContent>
    </DropdownMenuPrimitive.Root>
  );
};

// Export individual components for advanced usage
export {
  DropdownMenuPrimitive as DropdownMenuRoot,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItemComponent as DropdownMenuItem,
  DropdownMenuSeparator
};

// Simple Select-like component for basic use cases
export interface SelectProps {
  options: Array<{ value: string; label: string; icon?: React.ComponentType<{ className?: string }> }>;
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onValueChange,
  placeholder = 'Select...',
  disabled = false,
  className
}) => {
  const items: DropdownMenuItem[] = options.map(option => ({
    value: option.value,
    label: option.label,
    icon: option.icon
  }));

  return (
    <DropdownMenu
      items={items}
      value={value}
      onValueChange={onValueChange}
      placeholder={placeholder}
      disabled={disabled}
      className={className}
    />
  );
};