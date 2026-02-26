import { useState } from 'react';
import { FolderKanban, CheckSquare, FileText, DollarSign } from 'lucide-react';
import { useProjects } from '../../hooks/useProjects';
import { useTasks } from '../../hooks/useTasks';

const TimerSetupForm = ({ onStart }) => {
  const [project, setProject] = useState('');
  const [task, setTask] = useState('');
  const [description, setDescription] = useState('');
  const [isBillable, setIsBillable] = useState(true);

  const { projects, isLoading: projectsLoading } = useProjects();
  const { tasks, isLoading: tasksLoading } = useTasks();

  // Filter tasks by selected project
  const filteredTasks = Array.isArray(tasks)
    ? tasks.filter(t => {
        const taskProjectId = t.project?._id || t.project;
        return taskProjectId === project;
      })
    : [];

  const handleStart = () => {
    if (!project) {
      alert('Please select a project');
      return;
    }

    onStart({
      project,
      task: task || undefined,
      description,
      isBillable,
    });
  };

  return (
    <div className="card max-w-2xl mx-auto">
      <h3 className="text-lg font-display font-bold text-dark-text mb-6">
        What are you working on?
      </h3>

      <div className="space-y-4">
        {/* Project Selection */}
        <div>
          <label className="block text-sm font-medium text-dark-text mb-2">
            <FolderKanban className="w-4 h-4 inline mr-2" />
            Project <span className="text-error">*</span>
          </label>
          <select
            value={project}
            onChange={(e) => {
              setProject(e.target.value);
              setTask(''); // Reset task when project changes
            }}
            className="input"
            disabled={projectsLoading}
          >
            <option value="">
              {projectsLoading ? 'Loading projects...' : 'Select a project...'}
            </option>
            {Array.isArray(projects) && projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Task Selection */}
        <div>
          <label className="block text-sm font-medium text-dark-text mb-2">
            <CheckSquare className="w-4 h-4 inline mr-2" />
            Task (Optional)
          </label>
          <select
            value={task}
            onChange={(e) => setTask(e.target.value)}
            className="input"
            disabled={!project || tasksLoading}
          >
            <option value="">
              {!project 
                ? 'Select a project first' 
                : tasksLoading 
                  ? 'Loading tasks...' 
                  : 'Select a task...'}
            </option>
            {filteredTasks.map((t) => (
              <option key={t._id} value={t._id}>
                {t.title}
              </option>
            ))}
          </select>
          {project && filteredTasks.length === 0 && !tasksLoading && (
            <p className="text-xs text-dark-muted mt-1">
              No tasks in this project yet
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-dark-text mb-2">
            <FileText className="w-4 h-4 inline mr-2" />
            Description (Optional)
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What are you doing?"
            className="input"
          />
        </div>

        {/* Billable Toggle */}
        <div className="flex items-center justify-between p-4 bg-dark-bg3 rounded-lg border border-dark-border">
          <div className="flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-success" />
            <div>
              <p className="text-sm font-medium text-dark-text">Billable</p>
              <p className="text-xs text-dark-muted">Track as billable hours</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isBillable}
              onChange={(e) => setIsBillable(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-dark-border peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-success"></div>
          </label>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStart}
          disabled={!project || projectsLoading}
          className="btn btn-primary w-full btn-lg"
        >
          Start Timer
        </button>
      </div>
    </div>
  );
};

export default TimerSetupForm;