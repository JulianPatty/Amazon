import React from 'react';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import { cn } from '../../utils/cn';

// TypeScript interfaces
export interface ScrollAreaProps extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> {
  className?: string;
  children: React.ReactNode;
  orientation?: 'vertical' | 'horizontal' | 'both';
  scrollHideDelay?: number;
  type?: 'auto' | 'always' | 'scroll' | 'hover';
}

export interface ScrollBarProps extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Scrollbar> {
  className?: string;
  orientation?: 'vertical' | 'horizontal';
}

// Base ScrollArea Components
const ScrollAreaRoot = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn('relative overflow-hidden', className)}
    {...props}
  >
    {children}
  </ScrollAreaPrimitive.Root>
));
ScrollAreaRoot.displayName = 'ScrollAreaRoot';

const ScrollAreaViewport = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Viewport>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Viewport
    ref={ref}
    className={cn('h-full w-full rounded-[inherit]', className)}
    {...props}
  >
    {children}
  </ScrollAreaPrimitive.Viewport>
));
ScrollAreaViewport.displayName = 'ScrollAreaViewport';

const ScrollAreaScrollbar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Scrollbar>,
  ScrollBarProps
>(({ className, orientation = 'vertical', ...props }, ref) => (
  <ScrollAreaPrimitive.Scrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      'flex touch-none select-none transition-colors',
      orientation === 'vertical' &&
        'h-full w-2.5 border-l border-l-transparent p-[1px]',
      orientation === 'horizontal' &&
        'h-2.5 flex-col border-t border-t-transparent p-[1px]',
      'hover:bg-gray-50',
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.Thumb className="relative flex-1 rounded-full bg-gray-300 hover:bg-gray-400 transition-colors duration-150" />
  </ScrollAreaPrimitive.Scrollbar>
));
ScrollAreaScrollbar.displayName = 'ScrollAreaScrollbar';

const ScrollAreaCorner = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Corner>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Corner>
>(({ className, ...props }, ref) => (
  <ScrollAreaPrimitive.Corner
    ref={ref}
    className={cn('bg-gray-50', className)}
    {...props}
  />
));
ScrollAreaCorner.displayName = 'ScrollAreaCorner';

// Main ScrollArea Component
export const ScrollArea: React.FC<ScrollAreaProps> = ({
  className,
  children,
  orientation = 'vertical',
  scrollHideDelay = 600,
  type = 'hover',
  ...props
}) => {
  return (
    <ScrollAreaRoot
      className={className}
      scrollHideDelay={scrollHideDelay}
      type={type}
      {...props}
    >
      <ScrollAreaViewport>
        {children}
      </ScrollAreaViewport>
      
      {(orientation === 'vertical' || orientation === 'both') && (
        <ScrollAreaScrollbar orientation="vertical" />
      )}
      
      {(orientation === 'horizontal' || orientation === 'both') && (
        <ScrollAreaScrollbar orientation="horizontal" />
      )}
      
      {orientation === 'both' && <ScrollAreaCorner />}
    </ScrollAreaRoot>
  );
};

// Export individual components for advanced usage
export {
  ScrollAreaRoot,
  ScrollAreaViewport,
  ScrollAreaScrollbar,
  ScrollAreaCorner
};

// Export the primitive for direct access if needed
export { ScrollAreaPrimitive };