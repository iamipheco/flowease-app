import { useState } from 'react';
import { Plus, Grid3x3, List, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useProjects } from '../../hooks/useProjects';
import { useWorkspaceStore } from '../../store/workspaceStore';
import ProjectCard from '../../components/projects/ProjectCard';
import CreateProjectModal from '../../components/projects/CreateProjectModal';

const Projects = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [searchQuery, setSearchQuery] = useState('');

  const { activeWorkspace } = useWorkspaceStore();
  const { projects, isLoading, createProject, deleteProject, isCreating } = useProjects();

  const handleCreateProject = (data) => {
    createProject(
      {
        ...data,
        workspace: activeWorkspace._id,
      },
      {
        onSuccess: () => {
          setShowCreateModal(false);
        },
      }
    );
  };

  const handleEditProject = (project) => {
    // TODO: Open edit modal with project data
    console.log('Edit project:', project);
  };

  // Filter projects by search query
  const filteredProjects = Array.isArray(projects) 
    ? projects.filter((project) =>
        project?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project?.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-dark-text mb-2">
            Projects
          </h1>
          <p className="text-dark-muted">
            {activeWorkspace?.name} • {projects.length} project{projects.length !== 1 ? 's' : ''}
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
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
            className="input pl-10 w-full"
          />
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 bg-dark-bg2 border border-dark-border rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded transition-colors ${
              viewMode === 'grid'
                ? 'bg-primary text-white'
                : 'text-dark-muted hover:text-dark-text'
            }`}
          >
            <Grid3x3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded transition-colors ${
              viewMode === 'list'
                ? 'bg-primary text-white'
                : 'text-dark-muted hover:text-dark-text'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Projects Grid/List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-sm text-dark-muted">Loading projects...</p>
          </div>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-full bg-dark-bg3 flex items-center justify-center mx-auto mb-4">
            <Plus className="w-10 h-10 text-dark-muted" />
          </div>
          <h3 className="text-xl font-display font-bold text-dark-text mb-2">
            {searchQuery ? 'No projects found' : 'No projects yet'}
          </h3>
          <p className="text-sm text-dark-muted mb-6">
            {searchQuery
              ? 'Try adjusting your search query'
              : 'Create your first project to get started'}
          </p>
          {!searchQuery && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn btn-primary"
            >
              <Plus className="w-4 h-4" />
              Create First Project
            </button>
          )}
        </div>
      ) : (
        <motion.div
          layout
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }
        >
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onEdit={handleEditProject}
              onDelete={deleteProject}
            />
          ))}
        </motion.div>
      )}

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateProject}
        isLoading={isCreating}
      />
    </div>
  );
};

export default Projects;