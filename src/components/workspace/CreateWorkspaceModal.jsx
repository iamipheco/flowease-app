import { useState } from 'react';
import { X, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CreateWorkspaceModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      return;
    }

    onSubmit(formData);
    
    // Reset form
    setFormData({
      name: '',
      description: '',
    });
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-dark-bg2 border border-dark-border rounded-2xl shadow-2xl w-full max-w-md">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-dark-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-display font-bold text-dark-text">
                    Create Workspace
                  </h2>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-dark-bg3 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-dark-muted" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">
                    Workspace Name <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., My Company, Personal Projects"
                    className="input"
                    required
                    autoFocus
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="What's this workspace for?"
                    className="input min-h-[100px] resize-none"
                    rows={3}
                  />
                </div>

                {/* Info */}
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <p className="text-xs text-dark-muted">
                    💡 <strong className="text-dark-text">Tip:</strong> Workspaces help you organize projects, teams, and time tracking separately.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="btn btn-secondary flex-1"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary flex-1"
                    disabled={isLoading || !formData.name.trim()}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        Creating...
                      </div>
                    ) : (
                      'Create Workspace'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CreateWorkspaceModal;