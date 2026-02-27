import { Search, Filter } from "lucide-react";
import { motion } from "framer-motion";

const ReportFilters = ({
  selectedProject,
  setSelectedProject,
  selectedTask,
  setSelectedTask,
  billableFilter,
  setBillableFilter,
  searchQuery,
  setSearchQuery,
  projects,
  tasks,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="card"
    >
      <div className="flex items-center gap-2 mb-3">
        <Filter className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-dark-text">Filters</h3>
      </div>

      <div className="space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks, projects..."
            className="input pl-10 w-full text-sm"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {/* Project Filter */}
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="input text-sm"
          >
            <option value="all">All Projects</option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.name}
              </option>
            ))}
          </select>

          {/* Task Filter */}
          <select
            value={selectedTask}
            onChange={(e) => setSelectedTask(e.target.value)}
            className="input text-sm"
          >
            <option value="all">All Tasks</option>
            {tasks.map((task) => (
              <option key={task._id} value={task._id}>
                {task.title}
              </option>
            ))}
          </select>

          {/* Billable Filter */}
          <select
            value={billableFilter}
            onChange={(e) => setBillableFilter(e.target.value)}
            className="input text-sm"
          >
            <option value="all">All Entries</option>
            <option value="billable">Billable Only</option>
            <option value="non-billable">Non-billable Only</option>
          </select>
        </div>
      </div>
    </motion.div>
  );
};

export default ReportFilters;