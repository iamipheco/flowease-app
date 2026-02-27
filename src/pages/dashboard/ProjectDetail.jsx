/* ======================================================
   src/pages/dashboard/ProjectDetail.jsx
   Project Detail Page with Tabs - Asana Style
====================================================== */
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Settings, Star, Users, MoreHorizontal,
  LayoutGrid, CalendarRange, UsersRound, FileText
} from "lucide-react";
import ProjectOverview from "../../components/projects/ProjectOverview";
import ProjectTasksBoard from "../../components/projects/ProjectTaskBoard";
import ProjectTimeline from "../../components/projects/ProjectTimeline";
import ProjectTeamWorkload from "../../components/projects/ProjectTeamWorkload";
import { useProjects } from "../../hooks/useProjects";
import { cn } from "../../utils/cn";

const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  
  const { projects, isLoading } = useProjects();
  const project = projects.find(p => p._id === projectId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-dark-muted">Project not found</p>
        <button onClick={() => navigate('/dashboard/projects')} className="btn btn-primary">
          Back to Projects
        </button>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutGrid },
    { id: 'tasks', label: 'Board', icon: LayoutGrid },
    { id: 'timeline', label: 'Timeline', icon: CalendarRange },
    { id: 'team', label: 'Workload', icon: UsersRound },
    { id: 'files', label: 'Files', icon: FileText },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden bg-dark-bg1">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-dark-border bg-dark-bg2">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard/projects')}
              className="p-2 hover:bg-dark-bg3 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-dark-text" />
            </button>
            
            <div className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: project.color || '#3b82f6' }}
              />
              <h1 className="text-xl font-bold text-dark-text">
                {project.name}
              </h1>
            </div>

            <div className={cn(
              "px-2 py-1 rounded text-xs font-medium",
              project.status === 'active' ? 'bg-primary text-white' :
              project.status === 'on-hold' ? 'bg-warning text-white' :
              'bg-success text-white'
            )}>
              {project.status === 'active' ? 'On track' : project.status}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-dark-bg3 rounded-lg transition-colors">
              <Star className="w-5 h-5 text-dark-muted" />
            </button>
            <button className="p-2 hover:bg-dark-bg3 rounded-lg transition-colors">
              <Users className="w-5 h-5 text-dark-muted" />
            </button>
            <button className="p-2 hover:bg-dark-bg3 rounded-lg transition-colors">
              <Settings className="w-5 h-5 text-dark-muted" />
            </button>
            <button className="p-2 hover:bg-dark-bg3 rounded-lg transition-colors">
              <MoreHorizontal className="w-5 h-5 text-dark-muted" />
            </button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex items-center gap-1 px-6 border-t border-dark-border">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 border-b-2 transition-colors",
                  activeTab === tab.id
                    ? "border-primary text-dark-text font-medium"
                    : "border-transparent text-dark-muted hover:text-dark-text"
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'overview' && <ProjectOverview project={project} />}
        {activeTab === 'tasks' && <ProjectTasksBoard project={project} />}
        {activeTab === 'timeline' && <ProjectTimeline project={project} />}
        {activeTab === 'team' && <ProjectTeamWorkload project={project} />}
        {activeTab === 'files' && (
          <div className="p-6">
            <p className="text-dark-muted italic">Files view coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;