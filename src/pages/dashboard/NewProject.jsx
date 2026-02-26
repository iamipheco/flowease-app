import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useProjects } from '../../hooks/useProjects';
import { useWorkspaceStore } from '../../store/workspaceStore';
import CreateProjectModal from '../../components/projects/CreateProjectModal';

const NewProject = () => {
  const navigate = useNavigate();
  const { activeWorkspace } = useWorkspaceStore();
  const { createProject, isCreating } = useProjects();

  const handleCreateProject = (data) => {
    createProject(
      {
        ...data,
        workspace: activeWorkspace._id,
      },
      {
        onSuccess: (response) => {
          // Navigate to the new project page or projects list
          navigate('/dashboard/projects');
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/dashboard/projects')}
        className="flex items-center gap-2 text-dark-muted hover:text-dark-text transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back to Projects</span>
      </button>

      {/* Modal is always open on this page */}
      <CreateProjectModal
        isOpen={true}
        onClose={() => navigate('/dashboard/projects')}
        onSubmit={handleCreateProject}
        isLoading={isCreating}
      />
    </div>
  );
};

export default NewProject;