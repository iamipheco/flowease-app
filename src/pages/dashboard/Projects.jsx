/* ======================================================
   src/pages/dashboard/Projects.jsx
   Projects Board View - Asana Style
====================================================== */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, LayoutGrid, List, Filter, MoreHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useProjects } from "../../hooks/useProjects";
import { useWorkspaceStore } from "../../store/workspaceStore";
import ProjectCard from "../../components/projects/ProjectCard";
import CreateProjectModal from "../../components/projects/CreateProjectModal";

const Projects = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("board");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { activeWorkspace } = useWorkspaceStore();
  const { projects, isLoading, createProject, updateProject, deleteProject } = useProjects();

  const handleProjectClick = (project) => {
    // ✨ Navigate to project detail page instead of opening sidebar
    navigate(`/dashboard/projects/${project._id}`);
  };

  const handleCreateProject = (data) => {
    createProject(
      { ...data, workspace: activeWorkspace._id },
      {
        onSuccess: () => {
          setShowCreateModal(false);
        },
      }
    );
  };

  // Filter projects
  const filteredProjects = projects.filter((project) =>
    project.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group by status for board view
  const projectsByStatus = {
    active: filteredProjects.filter((p) => p.status === "active"),
    "on-hold": filteredProjects.filter((p) => p.status === "on-hold"),
    completed: filteredProjects.filter((p) => p.status === "completed"),
  };

  const statusColumns = [
    { key: "active", label: "Active", color: "border-primary" },
    { key: "on-hold", label: "On Hold", color: "border-warning" },
    { key: "completed", label: "Completed", color: "border-success" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-dark-text mb-2">
            Projects
          </h1>
          <p className="text-dark-muted">
            {activeWorkspace?.name} • {projects.length} project
            {projects.length !== 1 ? "s" : ""}
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted pointer-events-none z-10" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
            className="input input-with-icon-left w-full"
          />
        </div>

        <div className="flex items-center gap-2">
          <button className="btn btn-secondary btn-sm">
            <Filter className="w-4 h-4" />
            Filter
          </button>

          <div className="flex items-center gap-1 bg-dark-bg2 border border-dark-border rounded-lg p-1">
            <button
              onClick={() => setViewMode("board")}
              className={`p-2 rounded transition-colors ${
                viewMode === "board"
                  ? "bg-primary text-white"
                  : "text-dark-muted hover:text-dark-text"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded transition-colors ${
                viewMode === "list"
                  ? "bg-primary text-white"
                  : "text-dark-muted hover:text-dark-text"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-sm text-dark-muted">Loading projects...</p>
          </div>
        </div>
      ) : viewMode === "board" ? (
        /* Board View - Kanban Style */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {statusColumns.map((column) => (
            <div key={column.key} className="space-y-4">
              {/* Column Header */}
              <div className={`border-l-4 ${column.color} pl-3 py-2`}>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-dark-text">
                    {column.label}
                  </h3>
                  <span className="text-xs text-dark-muted">
                    {projectsByStatus[column.key].length}
                  </span>
                </div>
              </div>

              {/* Projects */}
              <div className="space-y-3">
                <AnimatePresence>
                  {projectsByStatus[column.key].map((project) => (
                    <ProjectCard
                      key={project._id}
                      project={project}
                      onClick={() => handleProjectClick(project)}
                    />
                  ))}
                </AnimatePresence>

                {projectsByStatus[column.key].length === 0 && (
                  <div className="card text-center py-8">
                    <p className="text-xs text-dark-muted">No projects</p>
                  </div>
                )}

                <button className="w-full text-left px-4 py-2 text-sm text-dark-muted hover:bg-dark-bg2 rounded-lg transition-colors flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add project
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onClick={() => handleProjectClick(project)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateProject}
      />
    </div>
  );
};

export default Projects;