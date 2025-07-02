import { useState, useCallback } from 'react';

export interface ContextMenuState {
  isOpen: boolean;
  position: { x: number; y: number };
  targetId: string | null;
  targetType: 'workflow' | 'folder' | null;
}

export const useContextMenu = () => {
  const [state, setState] = useState<ContextMenuState>({
    isOpen: false,
    position: { x: 0, y: 0 },
    targetId: null,
    targetType: null
  });

  const openContextMenu = useCallback((
    event: React.MouseEvent,
    targetId: string,
    targetType: 'workflow' | 'folder'
  ) => {
    event.preventDefault();
    event.stopPropagation();
    
    setState({
      isOpen: true,
      position: { x: event.clientX, y: event.clientY },
      targetId,
      targetType
    });
  }, []);

  const closeContextMenu = useCallback(() => {
    setState({
      isOpen: false,
      position: { x: 0, y: 0 },
      targetId: null,
      targetType: null
    });
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape' && state.isOpen) {
      closeContextMenu();
    }
  }, [state.isOpen, closeContextMenu]);

  return {
    state,
    openContextMenu,
    closeContextMenu,
    handleKeyDown
  };
};