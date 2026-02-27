import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import DashboardLayout from "../components/layout/DashboardLayout";
import Overview from "../pages/dashboard/Overview";
import MyTasks from "../pages/dashboard/MyTasks";
import Projects from "../pages/dashboard/Projects";
import TimeTracking from "../pages/dashboard/TimeTracking";
import { useAuthStore } from "../store/authStore";
import NewProject from "../components/projects/NewProject";
import TimeReports from "../pages/dashboard/TimeReports";
import ProjectDetail from "../pages/dashboard/ProjectDetail";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* Protected Dashboard Routes */}
      <Route path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Overview />} />
        <Route path="tasks" element={<MyTasks />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/new" element={<NewProject />} />
        <Route path="/dashboard/projects/:projectId" element={<ProjectDetail />} />
        <Route path="projects/:id" element={<div className="p-8">Project Details - Coming soon</div>} />
        <Route path="time" element={<TimeTracking />} />
        <Route path="/dashboard/time/reports" element={<TimeReports />} />
        <Route path="team" element={<div className="p-8">Team page coming soon...</div>} />
        <Route path="notifications" element={<div className="p-8">Notifications coming soon...</div>} />
        <Route path="settings" element={<div className="p-8">Settings coming soon...</div>} />
        <Route path="insights" element={<div className="p-8">Insights coming soon...</div>} />
        <Route path="reporting" element={<div className="p-8">Reporting coming soon...</div>} />
        <Route path="goals" element={<div className="p-8">Goals coming soon...</div>} />
        <Route path="inbox" element={<div className="p-8">Inbox coming soon...</div>} />
        <Route path="invite" element={<div className="p-8">Invite page coming soon...</div>} />
      </Route>

      {/* Redirect root */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* 404 */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-6xl font-display font-bold text-gradient mb-4">
                404
              </h1>
              <p className="text-dark-muted mb-6">Page not found</p>
              <a href="/" className="btn btn-primary">
                Go Home
              </a>
            </div>
          </div>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
