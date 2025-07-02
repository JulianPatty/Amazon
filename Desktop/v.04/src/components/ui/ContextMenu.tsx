import React from 'react';
import * as ContextMenuPrimitive from '@radix-ui/react-context-menu';
import { 
  Edit3, 
  Trash2, 
  Copy, 
  FolderPlus, 
  FileText, 
  Settings,
  Share,
  Download,
  Archive,
  Star,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '../../utils/cn';

// TypeScript interfaces
export interface ContextMenuAction {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  shortcut?: string;
  destructive?: boolean;
  disabled?: boolean;
  separator?: boolean;
  onClick: () => void;
}

export interface WorkflowContextMenuProps {
  children: React.ReactNode;
  workflowId: string;
  workflowName: string;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onShare: (id: string) => void;
  onExport: (id: string) => void;
  onArchive: (id: string) => void;
  onFavorite: (id: string) => void;
}

export interface FolderContextMenuProps {
  children: React.ReactNode;
  folderId: string;
  folderName: string;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  onCreateWorkflow: (folderId: string) => void;
  onCreateFolder: (parentId: string) => void;
  onSettings: (id: string) => void;
}

// Base Context Menu Components
const ContextMenuContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Portal>
    <ContextMenuPrimitive.Content
      ref={ref}
      className={cn(
        'z-50 min-w-[220px] overflow-hidden rounded-lg border border-gray-200 bg-white p-1 shadow-lg',
        'animate-in fade-in-0 zoom-in-95 data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
        'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
        'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        className
      )}
      {...props}
    />
  </ContextMenuPrimitive.Portal>
));
ContextMenuContent.displayName = 'ContextMenuContent';

const ContextMenuItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> & {
    destructive?: boolean;
    icon?: React.ComponentType<{ className?: string }>;
    shortcut?: string;
  }
>(({ className, destructive, icon: Icon, shortcut, children, ...props }, ref) => (
  <ContextMenuPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex cursor-pointer select-none items-center rounded-md px-3 py-2 text-sm outline-none',
      'transition-colors duration-150 focus:bg-gray-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      destructive 
        ? 'text-red-600 focus:bg-red-50 focus:text-red-700' 
        : 'text-gray-700 hover:bg-gray-50',
      className
    )}
    {...props}
  >
    {Icon && <Icon className="mr-3 h-4 w-4" />}
    <span className="flex-1">{children}</span>
    {shortcut && (
      <span className="ml-auto text-xs text-gray-400 tracking-widest">
        {shortcut}
      </span>
    )}
  </ContextMenuPrimitive.Item>
));
ContextMenuItem.displayName = 'ContextMenuItem';

const ContextMenuSeparator = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Separator
    ref={ref}
    className={cn('mx-2 my-1 h-px bg-gray-200 opacity-10', className)}
    {...props}
  />
));
ContextMenuSeparator.displayName = 'ContextMenuSeparator';

// Workflow Context Menu
export const WorkflowContextMenu: React.FC<WorkflowContextMenuProps> = ({
  children,
  workflowId,
  workflowName,
  onRename,
  onDelete,
  onDuplicate,
  onShare,
  onExport,
  onArchive,
  onFavorite
}) => {
  const handleRename = () => {
    const newName = prompt('Enter new workflow name:', workflowName);
    if (newName && newName.trim() !== workflowName) {
      onRename(workflowId, newName.trim());
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${workflowName}"?`)) {
      onDelete(workflowId);
    }
  };

  return (
    <ContextMenuPrimitive.Root>
      <ContextMenuPrimitive.Trigger asChild>
        {children}
      </ContextMenuPrimitive.Trigger>
      
      <ContextMenuContent>
        <ContextMenuItem
          icon={Edit3}
          shortcut="F2"
          onClick={handleRename}
          aria-label={`Rename ${workflowName}`}
        >
          Rename
        </ContextMenuItem>
        
        <ContextMenuItem
          icon={Copy}
          shortcut="⌘D"
          onClick={() => onDuplicate(workflowId)}
          aria-label={`Duplicate ${workflowName}`}
        >
          Duplicate
        </ContextMenuItem>
        
        <ContextMenuItem
          icon={Star}
          onClick={() => onFavorite(workflowId)}
          aria-label={`Add ${workflowName} to favorites`}
        >
          Add to Favorites
        </ContextMenuItem>
        
        <ContextMenuSeparator />
        
        <ContextMenuItem
          icon={Share}
          onClick={() => onShare(workflowId)}
          aria-label={`Share ${workflowName}`}
        >
          Share
        </ContextMenuItem>
        
        <ContextMenuItem
          icon={Download}
          shortcut="⌘E"
          onClick={() => onExport(workflowId)}
          aria-label={`Export ${workflowName}`}
        >
          Export
        </ContextMenuItem>
        
        <ContextMenuItem
          icon={Archive}
          onClick={() => onArchive(workflowId)}
          aria-label={`Archive ${workflowName}`}
        >
          Archive
        </ContextMenuItem>
        
        <ContextMenuSeparator />
        
        <ContextMenuItem
          icon={Trash2}
          shortcut="Del"
          destructive
          onClick={handleDelete}
          aria-label={`Delete ${workflowName}`}
        >
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenuPrimitive.Root>
  );
};

// Folder Context Menu
export const FolderContextMenu: React.FC<FolderContextMenuProps> = ({
  children,
  folderId,
  folderName,
  onRename,
  onDelete,
  onCreateWorkflow,
  onCreateFolder,
  onSettings
}) => {
  const handleRename = () => {
    const newName = prompt('Enter new folder name:', folderName);
    if (newName && newName.trim() !== folderName) {
      onRename(folderId, newName.trim());
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete the folder "${folderName}"?`)) {
      onDelete(folderId);
    }
  };

  return (
    <ContextMenuPrimitive.Root>
      <ContextMenuPrimitive.Trigger asChild>
        {children}
      </ContextMenuPrimitive.Trigger>
      
      <ContextMenuContent>
        <ContextMenuItem
          icon={FileText}
          onClick={() => onCreateWorkflow(folderId)}
          aria-label={`Create workflow in ${folderName}`}
        >
          New Workflow
        </ContextMenuItem>
        
        <ContextMenuItem
          icon={FolderPlus}
          onClick={() => onCreateFolder(folderId)}
          aria-label={`Create subfolder in ${folderName}`}
        >
          New Folder
        </ContextMenuItem>
        
        <ContextMenuSeparator />
        
        <ContextMenuItem
          icon={Edit3}
          shortcut="F2"
          onClick={handleRename}
          aria-label={`Rename ${folderName}`}
        >
          Rename
        </ContextMenuItem>
        
        <ContextMenuItem
          icon={Settings}
          onClick={() => onSettings(folderId)}
          aria-label={`Settings for ${folderName}`}
        >
          Settings
        </ContextMenuItem>
        
        <ContextMenuSeparator />
        
        <ContextMenuItem
          icon={Trash2}
          shortcut="Del"
          destructive
          onClick={handleDelete}
          aria-label={`Delete ${folderName}`}
        >
          Delete Folder
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenuPrimitive.Root>
  );
};

// Generic Context Menu for custom actions
export interface GenericContextMenuProps {
  children: React.ReactNode;
  actions: ContextMenuAction[];
}

export const GenericContextMenu: React.FC<GenericContextMenuProps> = ({
  children,
  actions
}) => {
  return (
    <ContextMenuPrimitive.Root>
      <ContextMenuPrimitive.Trigger asChild>
        {children}
      </ContextMenuPrimitive.Trigger>
      
      <ContextMenuContent>
        {actions.map((action, index) => (
          <React.Fragment key={action.id}>
            {action.separator && index > 0 && <ContextMenuSeparator />}
            <ContextMenuItem
              icon={action.icon}
              shortcut={action.shortcut}
              destructive={action.destructive}
              disabled={action.disabled}
              onClick={action.onClick}
              aria-label={action.label}
            >
              {action.label}
            </ContextMenuItem>
          </React.Fragment>
        ))}
      </ContextMenuContent>
    </ContextMenuPrimitive.Root>
  );
};

// Export all components
export {
  ContextMenuPrimitive as ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator
};