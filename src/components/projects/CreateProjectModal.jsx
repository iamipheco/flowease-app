import { useState } from 'react';
import { X, FolderKanban, Calendar, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CreateProjectModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    color: '#3b82f6',
  });

  const colors = [
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Green', value: '#10b981' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Yellow', value: '#f59e0b' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Indigo', value: '#6366f1' },
    { name: 'Orange', value: '#f97316' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      return;
    }

    // Prepare data
    const submitData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      color: formData.color,
    };

    // Add dates if provided
    if (formData.startDate) {
      submitData.startDate = formData.startDate;
    }
    if (formData.endDate) {
      submitData.endDate = formData.endDate;
    }

    onSubmit(submitData);
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      color: '#3b82f6',
    });
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      color: '#3b82f6',
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
            <div className="bg-dark-bg2 border border-dark-border rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-dark-border sticky top-0 bg-dark-bg2 z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FolderKanban className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-display font-bold text-dark-text">
                    Create New Project
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
                {/* Project Name */}
                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">
                    Project Name <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Website Redesign, Mobile App"
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
                    placeholder="What's this project about?"
                    className="input min-h-[100px] resize-none"
                    rows={3}
                  />
                </div>

                {/* Project Color */}
                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">
                    Project Color
                  </label>
                  <div className="grid grid-cols-8 gap-2">
                    {colors.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, color: color.value })}
                        className={`w-10 h-10 rounded-lg transition-all ${
                          formData.color === color.value
                            ? 'ring-2 ring-offset-2 ring-primary ring-offset-dark-bg2 scale-110'
                            : 'hover:scale-105'
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-text mb-2">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-text mb-2">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      End Date
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      min={formData.startDate}
                      className="input"
                    />
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <p className="text-xs text-dark-muted">
                    💡 <strong className="text-dark-text">Tip:</strong> You can add team members and tasks after creating the project.
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
                      'Create Project'
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

export default CreateProjectModal;