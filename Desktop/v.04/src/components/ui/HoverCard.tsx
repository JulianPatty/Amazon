import React from 'react';
import * as HoverCardPrimitive from '@radix-ui/react-hover-card';
import { cn } from '../../utils/cn';

// TypeScript interfaces
export interface HoverCardProps {
  children: React.ReactNode;
  content: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  openDelay?: number;
  closeDelay?: number;
  className?: string;
  contentClassName?: string;
}

// Base HoverCard Components
const HoverCardRoot = HoverCardPrimitive.Root;
const HoverCardTrigger = HoverCardPrimitive.Trigger;

const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({ className, align = 'center', sideOffset = 4, ...props }, ref) => (
  <HoverCardPrimitive.Content
    ref={ref}
    align={align}
    sideOffset={sideOffset}
    className={cn(
      'z-50 w-64 rounded-lg border border-gray-200 bg-white p-4 text-gray-950 shadow-lg outline-none',
      'data-[state=open]:animate-in data-[state=closed]:animate-out',
      'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
      'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
      'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
      'transition-all duration-200 ease-out',
      className
    )}
    {...props}
  />
));
HoverCardContent.displayName = 'HoverCardContent';

const HoverCardArrow = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Arrow>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Arrow>
>(({ className, ...props }, ref) => (
  <HoverCardPrimitive.Arrow
    ref={ref}
    className={cn('fill-white drop-shadow-sm', className)}
    {...props}
  />
));
HoverCardArrow.displayName = 'HoverCardArrow';

// Main HoverCard Component
export const HoverCard: React.FC<HoverCardProps> = ({
  children,
  content,
  side = 'bottom',
  align = 'center',
  openDelay = 300,
  closeDelay = 150,
  className,
  contentClassName
}) => {
  return (
    <HoverCardRoot openDelay={openDelay} closeDelay={closeDelay}>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent
        side={side}
        align={align}
        className={cn(contentClassName)}
      >
        {content}
        <HoverCardArrow />
      </HoverCardContent>
    </HoverCardRoot>
  );
};

// Export individual components for advanced usage
export {
  HoverCardRoot,
  HoverCardTrigger,
  HoverCardContent,
  HoverCardArrow
};

// Export the primitive for direct access if needed
export { HoverCardPrimitive };