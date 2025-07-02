import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/cn';

interface TooltipModalProps {
  children: React.ReactNode;
  content: React.ReactNode;
  title?: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  delayDuration?: number;
  className?: string;
  maxWidth?: string;
  disabled?: boolean;
}

interface Position {
  x: number;
  y: number;
}

export const TooltipModal: React.FC<TooltipModalProps> = ({
  children,
  content,
  title,
  side = 'top',
  align = 'center',
  delayDuration = 300,
  className,
  maxWidth = '320px',
  disabled = false
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [actualSide, setActualSide] = useState(side);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const hideTimeoutRef = useRef<NodeJS.Timeout>();

  const calculatePosition = (triggerRect: DOMRect, tooltipRect: DOMRect) => {
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
      scrollX: window.scrollX,
      scrollY: window.scrollY
    };

    const spacing = 8;
    let newSide = side;
    let x = 0;
    let y = 0;

    // Calculate initial position based on preferred side
    switch (side) {
      case 'top':
        x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        y = triggerRect.top - tooltipRect.height - spacing;
        break;
      case 'bottom':
        x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        y = triggerRect.bottom + spacing;
        break;
      case 'left':
        x = triggerRect.left - tooltipRect.width - spacing;
        y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        break;
      case 'right':
        x = triggerRect.right + spacing;
        y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        break;
    }

    // Check if tooltip would go outside viewport and adjust
    if (x < viewport.scrollX + 10) {
      if (side === 'left') {
        newSide = 'right';
        x = triggerRect.right + spacing;
      } else {
        x = viewport.scrollX + 10;
      }
    } else if (x + tooltipRect.width > viewport.scrollX + viewport.width - 10) {
      if (side === 'right') {
        newSide = 'left';
        x = triggerRect.left - tooltipRect.width - spacing;
      } else {
        x = viewport.scrollX + viewport.width - tooltipRect.width - 10;
      }
    }

    if (y < viewport.scrollY + 10) {
      if (side === 'top') {
        newSide = 'bottom';
        y = triggerRect.bottom + spacing;
      } else {
        y = viewport.scrollY + 10;
      }
    } else if (y + tooltipRect.height > viewport.scrollY + viewport.height - 10) {
      if (side === 'bottom') {
        newSide = 'top';
        y = triggerRect.top - tooltipRect.height - spacing;
      } else {
        y = viewport.scrollY + viewport.height - tooltipRect.height - 10;
      }
    }

    // Apply alignment adjustments
    if (newSide === 'top' || newSide === 'bottom') {
      switch (align) {
        case 'start':
          x = triggerRect.left;
          break;
        case 'end':
          x = triggerRect.right - tooltipRect.width;
          break;
      }
    } else {
      switch (align) {
        case 'start':
          y = triggerRect.top;
          break;
        case 'end':
          y = triggerRect.bottom - tooltipRect.height;
          break;
      }
    }

    setActualSide(newSide);
    return { x, y };
  };

  const updatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    
    const newPosition = calculatePosition(triggerRect, tooltipRect);
    setPosition(newPosition);
  };

  const showTooltip = () => {
    if (disabled) return;
    
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = undefined;
    }

    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      // Update position after tooltip becomes visible
      requestAnimationFrame(updatePosition);
    }, delayDuration);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }

    hideTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 100);
  };

  const handleMouseEnter = () => {
    showTooltip();
  };

  const handleMouseLeave = () => {
    hideTooltip();
  };

  const handleFocus = () => {
    showTooltip();
  };

  const handleBlur = () => {
    hideTooltip();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape' && isVisible) {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    if (isVisible) {
      updatePosition();
      
      const handleResize = () => updatePosition();
      const handleScroll = () => updatePosition();
      
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleScroll, true);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleScroll, true);
      };
    }
  }, [isVisible]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  const getArrowClasses = () => {
    const base = 'absolute w-2 h-2 bg-gray-900 transform rotate-45';
    
    switch (actualSide) {
      case 'top':
        return `${base} -bottom-1 left-1/2 -translate-x-1/2`;
      case 'bottom':
        return `${base} -top-1 left-1/2 -translate-x-1/2`;
      case 'left':
        return `${base} -right-1 top-1/2 -translate-y-1/2`;
      case 'right':
        return `${base} -left-1 top-1/2 -translate-y-1/2`;
      default:
        return base;
    }
  };

  const tooltipContent = (
    <div
      ref={tooltipRef}
      className={cn(
        'fixed z-[9999] rounded-lg bg-gray-900 text-white shadow-2xl border border-gray-700',
        'animate-in fade-in-0 zoom-in-95 duration-200',
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none',
        className
      )}
      style={{
        left: position.x,
        top: position.y,
        maxWidth,
        transform: isVisible ? 'scale(1)' : 'scale(0.95)'
      }}
      onMouseEnter={() => {
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current);
          hideTimeoutRef.current = undefined;
        }
      }}
      onMouseLeave={handleMouseLeave}
      role="tooltip"
      aria-hidden={!isVisible}
    >
      {/* Arrow */}
      <div className={getArrowClasses()} />
      
      {/* Content */}
      <div className="p-4">
        {title && (
          <div className="font-semibold text-white mb-2 text-sm">
            {title}
          </div>
        )}
        <div className="text-sm text-gray-200 leading-relaxed">
          {content}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="inline-block"
        tabIndex={0}
        aria-describedby={isVisible ? 'tooltip-modal' : undefined}
      >
        {children}
      </div>
      
      {isVisible && createPortal(tooltipContent, document.body)}
    </>
  );
};