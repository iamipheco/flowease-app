import { useState } from 'react';
import { X, Calendar, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProjects } from '../../hooks/useProjects';
import { useTasks } from '../../hooks/useTasks';

const ManualEntryModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    project: '',
    task: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '17:00',
    isBillable: true,
  });

  const { projects, isLoading: projectsLoading } = useProjects();
  const { tasks, isLoading: tasksLoading } = useTasks();

  // Filter tasks by selected project
  const filteredTasks = Array.isArray(tasks)
    ? tasks.filter(t => {
        const taskProjectId = t.project?._id || t.project;
        return taskProjectId === formData.project;
      })
    : [];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.project) {
      alert('Please select a project');
      return;
    }

    // Calculate duration
    const start = new Date(`${formData.date}T${formData.startTime}`);
    const end = new Date(`${formData.date}T${formData.endTime}`);
    const duration = Math.floor((end - start) / 1000 / 60);

    if (duration <= 0) {
      alert('End time must be after start time');
      return;
    }

    // Prepare data
    const submitData = {
      project: formData.project,
      task: formData.task || undefined,
      description: formData.description,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      isBillable: formData.isBillable,
      duration,
    };

    onSubmit(submitData);

    // Reset form
    setFormData({
      project: '',
      task: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '17:00',
      isBillable: true,
    });
  };

  const handleClose = () => {
    setFormData({
      project: '',
      task: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '17:00',
      isBillable: true,
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
                <h2 className="text-xl font-display font-bold text-dark-text">
                  Add Manual Time Entry
                </h2>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-dark-bg3 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-dark-muted" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Project */}
                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">
                    Project <span className="text-error">*</span>
                  </label>
                  <select
                    value={formData.project}
                    onChange={(e) => setFormData({ ...formData, project: e.target.value, task: '' })}
                    className="input"
                    required
                    disabled={projectsLoading}
                  >
                    <option value="">
                      {projectsLoading ? 'Loading...' : 'Select project...'}
                    </option>
                    {Array.isArray(projects) && projects.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Task (Optional) */}
                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">
                    Task (Optional)
                  </label>
                  <select
                    value={formData.task}
                    onChange={(e) => setFormData({ ...formData, task: e.target.value })}
                    className="input"
                    disabled={!formData.project || tasksLoading}
                  >
                    <option value="">
                      {!formData.project 
                        ? 'Select a project first' 
                        : tasksLoading 
                          ? 'Loading tasks...' 
                          : 'Select task...'}
                    </option>
                    {filteredTasks.map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="What did you work on?"
                    className="input"
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Date <span className="text-error">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    max={new Date().toISOString().split('T')[0]}
                    className="input"
                    required
                  />
                </div>

                {/* Time Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-text mb-2">
                      <Clock className="w-4 h-4 inline mr-2" />
                      Start Time <span className="text-error">*</span>
                    </label>
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      className="input"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-text mb-2">
                      <Clock className="w-4 h-4 inline mr-2" />
                      End Time <span className="text-error">*</span>
                    </label>
                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      className="input"
                      required
                    />
                  </div>
                </div>

                {/* Duration Preview */}
                {formData.startTime && formData.endTime && (
                  <div className="p-3 bg-dark-bg3 rounded-lg border border-dark-border">
                    <p className="text-xs text-dark-muted">Duration:</p>
                    <p className="text-lg font-display font-bold text-dark-text">
                      {(() => {
                        const start = new Date(`${formData.date}T${formData.startTime}`);
                        const end = new Date(`${formData.date}T${formData.endTime}`);
                        const minutes = Math.floor((end - start) / 1000 / 60);
                        const hours = Math.floor(minutes / 60);
                        const mins = minutes % 60;
                        return minutes > 0 
                          ? `${hours}h ${mins}m` 
                          : 'Invalid time range';
                      })()}
                    </p>
                  </div>
                )}

                {/* Billable */}
                <div className="flex items-center gap-3 p-4 bg-dark-bg3 rounded-lg border border-dark-border">
                  <input
                    type="checkbox"
                    id="billable"
                    checked={formData.isBillable}
                    onChange={(e) => setFormData({ ...formData, isBillable: e.target.checked })}
                    className="w-5 h-5 rounded border-dark-border bg-dark-bg2 text-primary focus:ring-2 focus:ring-primary/50"
                  />
                  <label htmlFor="billable" className="text-sm font-medium text-dark-text cursor-pointer flex-1">
                    Billable hours
                  </label>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="btn btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary flex-1"
                  >
                    Add Entry
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

export default ManualEntryModal;