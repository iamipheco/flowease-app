import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Plus, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkspaces } from '../../hooks/useWorkspaces';
import { cn } from '../../utils/cn';

const WorkspaceSwitcher = ({ onCreateNew, collapsed = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const { workspaces, activeWorkspace, switchWorkspace, isLoading } = useWorkspaces();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleWorkspaceClick = (workspaceId) => {
    switchWorkspace(workspaceId);
    setIsOpen(false);
  };

  // Get workspace initials for avatar
  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'W';
  };

  // Get workspace color
  const getWorkspaceColor = (workspace) => {
    return workspace?.branding?.color || '#3b82f6';
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 p-2">
        <div className="w-8 h-8 rounded-lg bg-dark-bg3 animate-pulse" />
        {!collapsed && <div className="h-4 bg-dark-bg3 rounded flex-1 animate-pulse" />}
      </div>
    );
  }

  if (!activeWorkspace) {
    return (
      <button
        onClick={onCreateNew}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-dark-bg3 transition-colors text-dark-muted"
      >
        <Plus className="w-4 h-4" />
        {!collapsed && <span className="text-sm">Create Workspace</span>}
      </button>
    );
  }

  if (collapsed) {
    return (
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-full"
      >
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center font-semibold text-sm text-white"
          style={{ backgroundColor: getWorkspaceColor(activeWorkspace) }}
        >
          {getInitials(activeWorkspace.name)}
        </div>
      </button>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Workspace Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-dark-bg3 transition-colors group"
      >
        {/* Workspace Avatar */}
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center font-semibold text-sm text-white flex-shrink-0"
          style={{ backgroundColor: getWorkspaceColor(activeWorkspace) }}
        >
          {getInitials(activeWorkspace.name)}
        </div>

        {/* Workspace Info */}
        <div className="flex-1 text-left min-w-0">
          <p className="text-sm font-medium text-dark-text truncate">
            {activeWorkspace.name}
          </p>
          <p className="text-xs text-dark-muted">
            {workspaces.length} workspace{workspaces.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Dropdown Icon */}
        <ChevronDown
          className={cn(
            'w-4 h-4 text-dark-muted transition-transform flex-shrink-0',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for mobile */}
            <div
              className="fixed inset-0 z-40 lg:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 right-0 mt-2 bg-dark-bg3 border border-dark-border rounded-xl shadow-xl overflow-hidden z-50"
            >
              {/* Workspace List */}
              <div className="p-2 max-h-64 overflow-y-auto">
                {workspaces.map((workspace) => (
                  <button
                    key={workspace._id}
                    onClick={() => handleWorkspaceClick(workspace._id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left',
                      workspace._id === activeWorkspace._id
                        ? 'bg-primary/10 text-primary'
                        : 'text-dark-text hover:bg-dark-bg2'
                    )}
                  >
                    {/* Workspace Avatar */}
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-semibold text-xs text-white flex-shrink-0"
                      style={{ backgroundColor: getWorkspaceColor(workspace) }}
                    >
                      {getInitials(workspace.name)}
                    </div>

                    {/* Workspace Name */}
                    <span className="text-sm font-medium truncate flex-1">
                      {workspace.name}
                    </span>

                    {/* Active Indicator */}
                    {workspace._id === activeWorkspace._id && (
                      <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>

              {/* Divider */}
              <div className="border-t border-dark-border" />

              {/* Actions */}
              <div className="p-2">
                <button
                  onClick={() => {
                    onCreateNew();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-dark-bg2 text-dark-text transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-dark-border flex items-center justify-center flex-shrink-0">
                    <Plus className="w-4 h-4 text-dark-muted" />
                  </div>
                  <span className="text-sm font-medium">Create workspace</span>
                </button>

                {/* Settings - Placeholder */}
                <button
                  onClick={() => {
                    // TODO: Open workspace settings
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 mt-1 rounded-lg hover:bg-dark-bg2 text-dark-muted hover:text-dark-text transition-colors text-left"
                >
                  <Settings className="w-4 h-4" />
                  <span className="text-sm">Workspace settings</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WorkspaceSwitcher;