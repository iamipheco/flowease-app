import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CheckSquare,
  Clock,
  Inbox,
  BarChart3,
  FileText,
  Target,
  FolderKanban,
  ChevronDown,
  ChevronRight,
  UserPlus,
  Plus,
  LayoutGrid,
  Briefcase,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useProjects } from "../../hooks/useProjects";
import { useUIStore } from "../../store/uiStore";
import { useWorkspaces } from "../../hooks/useWorkspaces";
import WorkspaceSwitcher from "../workspace/WorkspaceSwitcher";
import CreateWorkspaceModal from "../workspace/CreateWorkspaceModal";
import { cn } from "../../utils/cn";

const Sidebar = () => {
  const { isSidebarOpen } = useUIStore();
  const { createWorkspace, isCreating } = useWorkspaces();
  const { projects, isLoading: projectsLoading } = useProjects();
  const navigate = useNavigate();

  const [projectsExpanded, setProjectsExpanded] = useState(true);
  const [showProjectMenu, setShowProjectMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showCreateWorkspace, setShowCreateWorkspace] = useState(false);
  const projectMenuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        projectMenuRef.current &&
        !projectMenuRef.current.contains(event.target)
      ) {
        setShowProjectMenu(false);
        setShowSortMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sortOptions = [
    { label: "Alphabetical", value: "alphabetical", active: false },
    { label: "Recent", value: "recent", active: false },
    { label: "Top", value: "top", active: true },
  ];

  const mainNavigation = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Tasks", href: "/dashboard/tasks", icon: CheckSquare },
    { name: "Time Tracking", href: "/dashboard/time", icon: Clock },
    { name: "Inbox", href: "/dashboard/inbox", icon: Inbox },
  ];

  const insightsNavigation = [
    { name: "Insights", href: "/dashboard/insights", icon: BarChart3 },
    { name: "Reporting", href: "/dashboard/reporting", icon: FileText },
    { name: "Goals", href: "/dashboard/goals", icon: Target },
  ];

  const handleCreateWorkspace = (data) => {
    createWorkspace(data, {
      onSuccess: () => {
        setShowCreateWorkspace(false);
      },
    });
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-50 h-screen border-r transition-all duration-300 hidden lg:block",
        "bg-dark-bg2 border-dark-border",
        isSidebarOpen ? "w-64" : "w-20",
      )}
    >
      <div className="flex flex-col h-full">
        {/* LOGO */}
        <div className="h-16 flex items-center justify-center border-b border-dark-border">
          {isSidebarOpen ? (
            <div className="flex items-center gap-3 px-4 w-full">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center glow-primary">
                <Clock className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-xl font-display font-bold text-gradient">
                FlowEase
              </span>
            </div>
          ) : (
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center glow-primary">
              <Clock className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
          )}
        </div>

        {/* WORKSPACE SWITCHER */}
        <div className="px-4 py-3 border-b border-dark-border">
          {isSidebarOpen ? (
            <>
              <div className="text-xs font-semibold text-dark-muted uppercase tracking-wider mb-2">
                Workspace
              </div>
              <WorkspaceSwitcher
                onCreateNew={() => setShowCreateWorkspace(true)}
                collapsed={false}
              />
            </>
          ) : (
            <WorkspaceSwitcher
              onCreateNew={() => setShowCreateWorkspace(true)}
              collapsed={true}
            />
          )}
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto">
          {/* MAIN NAVIGATION */}
          <nav className="px-3 py-4 border-b border-dark-border">
            {isSidebarOpen && (
              <div className="text-xs font-semibold text-dark-muted uppercase tracking-wider mb-3 px-2">
                Main
              </div>
            )}
            <div className="space-y-1">
              {mainNavigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  end={item.href === "/dashboard"}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg transition-all group",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-dark-muted hover:bg-dark-bg3 hover:text-dark-text",
                      !isSidebarOpen && "justify-center",
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon
                        className={cn(
                          "w-5 h-5 flex-shrink-0",
                          isActive
                            ? "text-primary"
                            : "text-dark-muted group-hover:text-dark-text",
                        )}
                      />
                      {isSidebarOpen && (
                        <span className="text-sm font-medium">{item.name}</span>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </nav>

          {/* INSIGHTS SECTION */}
          <nav className="px-3 py-4 border-b border-dark-border">
            {isSidebarOpen && (
              <div className="text-xs font-semibold text-dark-muted uppercase tracking-wider mb-3 px-2">
                Analytics
              </div>
            )}
            <div className="space-y-1">
              {insightsNavigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg transition-all group",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-dark-muted hover:bg-dark-bg3 hover:text-dark-text",
                      !isSidebarOpen && "justify-center",
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon
                        className={cn(
                          "w-5 h-5 flex-shrink-0",
                          isActive
                            ? "text-primary"
                            : "text-dark-muted group-hover:text-dark-text",
                        )}
                      />
                      {isSidebarOpen && (
                        <span className="text-sm font-medium">{item.name}</span>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </nav>

          {/* PROJECTS SECTION */}
          <nav className="px-3 py-4">
            {isSidebarOpen ? (
              <div className="relative" ref={projectMenuRef}>
                <button
                  onClick={() => setShowProjectMenu(!showProjectMenu)}
                  className="w-full flex items-center justify-between px-2 mb-3 group hover:bg-dark-bg3 rounded-lg py-1 transition-colors"
                >
                  <div className="text-xs font-semibold text-dark-muted uppercase tracking-wider">
                    Projects
                  </div>
                  <div className="flex items-center gap-1">
                    {/* Changed button to div */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/dashboard/projects");
                      }}
                      className="p-1 hover:bg-dark-border rounded transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-dark-muted" />
                    </div>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 text-dark-muted transition-transform",
                        showProjectMenu && "rotate-180",
                      )}
                    />
                  </div>
                </button>

                {/* Projects Dropdown */}
                <AnimatePresence>
                  {showProjectMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 right-0 mt-1 bg-dark-bg3 border border-dark-border rounded-xl shadow-xl overflow-hidden z-50"
                    >
                      {/* Header Actions */}
                      <div className="p-2 border-b border-dark-border">
                        <button
                          onClick={() => {
                            navigate("/dashboard/projects");
                            setShowProjectMenu(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-dark-bg2 text-dark-text transition-colors text-left"
                        >
                          <div className="w-6 h-6 rounded bg-dark-border flex items-center justify-center">
                            <Plus className="w-3.5 h-3.5 text-dark-muted" />
                          </div>
                          <span className="text-sm font-medium">
                            New project
                          </span>
                        </button>

                        <button
                          onClick={() => {
                            navigate("/dashboard/projects/portfolio");
                            setShowProjectMenu(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 mt-1 rounded-lg hover:bg-dark-bg2 text-dark-text transition-colors text-left"
                        >
                          <div className="w-6 h-6 rounded bg-dark-border flex items-center justify-center">
                            <Briefcase className="w-3.5 h-3.5 text-dark-muted" />
                          </div>
                          <span className="text-sm font-medium">
                            New portfolio
                          </span>
                        </button>

                        <button
                          onClick={() => {
                            navigate("/dashboard/projects");
                            setShowProjectMenu(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 mt-1 rounded-lg hover:bg-dark-bg2 text-dark-muted hover:text-dark-text transition-colors text-left"
                        >
                          <LayoutGrid className="w-4 h-4" />
                          <span className="text-sm">Browse projects</span>
                          <ChevronRight className="w-4 h-4 ml-auto" />
                        </button>
                      </div>

                      {/* Sort Options */}
                      <div className="p-2 border-b border-dark-border">
                        <button
                          onClick={() => setShowSortMenu(!showSortMenu)}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-dark-bg2 text-dark-muted hover:text-dark-text transition-colors text-left text-xs"
                        >
                          <span>Sort projects and portfolios</span>
                          <ChevronRight
                            className={cn(
                              "w-3.5 h-3.5 transition-transform",
                              showSortMenu && "rotate-90",
                            )}
                          />
                        </button>

                        {showSortMenu && (
                          <div className="mt-1 ml-3 space-y-1">
                            {sortOptions.map((option) => (
                              <button
                                key={option.value}
                                className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg hover:bg-dark-bg2 text-dark-muted hover:text-dark-text transition-colors text-left text-xs"
                              >
                                <span>{option.label}</span>
                                {option.active && (
                                  <Check className="w-3.5 h-3.5 text-primary" />
                                )}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Projects List in Dropdown */}
                      <div className="p-2 max-h-48 overflow-y-auto">
                        {projectsLoading ? (
                          <div className="p-4 text-center">
                            <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-2" />
                            <p className="text-xs text-dark-muted">
                              Loading...
                            </p>
                          </div>
                        ) : !projects || projects.length === 0 ? (
                          <div className="p-4 text-center">
                            <p className="text-sm text-dark-muted mb-3">
                              No projects yet
                            </p>
                            <button
                              onClick={() => {
                                navigate("/dashboard/projects");
                                setShowProjectMenu(false);
                              }}
                              className="btn btn-primary btn-sm w-full"
                            >
                              <Plus className="w-4 h-4" />
                              Create First Project
                            </button>
                          </div>
                        ) : (
                          Array.isArray(projects) &&
                          projects.map((project) => (
                            <button
                              key={project._id}
                              onClick={() => {
                                navigate(`/dashboard/projects/${project._id}`);
                                setShowProjectMenu(false);
                              }}
                              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-dark-bg2 text-dark-text transition-colors text-left"
                            >
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{
                                  backgroundColor: project?.color || "#3b82f6",
                                }}
                              />
                              <span className="text-sm truncate">
                                {project?.name || "Unnamed Project"}
                              </span>
                            </button>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Projects List (Always Visible) */}
                {projectsExpanded && (
                  <div className="space-y-1 mt-2">
                    {projectsLoading ? (
                      <div className="px-3 py-2 text-xs text-dark-muted text-center">
                        Loading projects...
                      </div>
                    ) : !projects || projects.length === 0 ? (
                      <button
                        onClick={() => navigate("/dashboard/projects")}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-dark-muted hover:bg-dark-bg3 hover:text-dark-text transition-all text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Create your first project</span>
                      </button>
                    ) : (
                      Array.isArray(projects) &&
                      projects.slice(0, 5).map((project) => (
                        <NavLink
                          key={project._id}
                          to={`/dashboard/projects/${project._id}`}
                          className={({ isActive }) =>
                            cn(
                              "flex items-center gap-3 px-3 py-2 rounded-lg transition-all group",
                              isActive
                                ? "bg-primary/10 text-primary"
                                : "text-dark-muted hover:bg-dark-bg3 hover:text-dark-text",
                            )
                          }
                        >
                          <div
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{
                              backgroundColor: project?.color || "#3b82f6",
                            }}
                          />
                          <span className="text-sm font-medium truncate flex-1">
                            {project?.name || "Unnamed Project"}
                          </span>
                        </NavLink>
                      ))
                    )}
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate("/dashboard/projects")}
                className="w-full p-2 rounded-lg hover:bg-dark-bg3 transition-colors"
              >
                <FolderKanban className="w-5 h-5 text-dark-muted mx-auto" />
              </button>
            )}
          </nav>
        </div>

        {/* INVITE TEAMMATE - Bottom */}
        <div className="p-4 border-t border-dark-border">
          {isSidebarOpen ? (
            <button
              onClick={() => navigate("/dashboard/invite")}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-dark-bg3 hover:bg-dark-border text-dark-text rounded-lg transition-all border border-dark-border"
            >
              <UserPlus className="w-4 h-4" />
              <span className="text-sm font-medium">Invite teammates</span>
            </button>
          ) : (
            <button
              onClick={() => navigate("/dashboard/invite")}
              className="w-full p-2 rounded-lg hover:bg-dark-bg3 transition-colors"
            >
              <UserPlus className="w-5 h-5 text-dark-muted mx-auto" />
            </button>
          )}
        </div>
      </div>

      {/* Create Workspace Modal */}
      <CreateWorkspaceModal
        isOpen={showCreateWorkspace}
        onClose={() => setShowCreateWorkspace(false)}
        onSubmit={handleCreateWorkspace}
        isLoading={isCreating}
      />
    </aside>
  );
};

export default Sidebar;
