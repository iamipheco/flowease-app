import { useState, useRef, useEffect } from "react";
import {
  Search,
  Bell,
  Plus,
  Menu,
  LogOut,
  User as UserIcon,
  UserPlus,
  Settings,
  Sun,
  Moon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUIStore } from "../../store/uiStore";
import { useAuthStore } from "../../store/authStore";
import { useAuth } from "../../hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { getInitials } from "../../utils/formatters";

const Header = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const { toggleMobileMenu, theme, toggleTheme } = useUIStore();
  const { user } = useAuthStore();
  const { logout, isLoggingOut } = useAuth();
  const navigate = useNavigate();

  const userMenuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setShowUserMenu(false);
    logout();
  };

  return (
    <header className="sticky top-0 z-40 bg-dark-bg dark:bg-dark-bg border-b border-dark-border dark:border-dark-border transition-colors">
      <div className="flex items-center justify-between px-4 lg:px-6 h-16">
        {/* Left Side */}
        <div className="flex items-center gap-4 flex-1">
          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 rounded-lg hover:bg-dark-bg2 dark:hover:bg-dark-bg2 transition-colors"
          >
            <Menu className="w-5 h-5 text-dark-muted dark:text-dark-muted" />
          </button>

          {/* Search Bar - All Screens */}
          <div className="flex items-center flex-1 max-w-lg">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted pointer-events-none" />
              <input
                type="text"
                placeholder="Search tasks, projects..."
                className="w-full pl-10 pr-4 py-2.5 bg-dark-bg2 border border-dark-border rounded-lg text-sm text-dark-text placeholder:text-dark-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          {/* Create Project Button - Desktop Only */}
          <button
            onClick={() => navigate("/dashboard/projects/new")}
            className="hidden lg:flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-600 text-white rounded-lg transition-colors shadow-lg shadow-primary/20 font-medium text-sm"
          >
            <div className="w-5 h-5 bg-white/20 rounded flex items-center justify-center">
              <Plus className="w-3.5 h-3.5" />
            </div>
            Create a project
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-dark-bg2 dark:hover:bg-dark-bg2 transition-colors"
            title={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            <AnimatePresence mode="wait" initial={false}>
              {theme === "dark" ? (
                <motion.div
                  key="moon"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Moon className="w-5 h-5 text-dark-muted dark:text-dark-muted" />
                </motion.div>
              ) : (
                <motion.div
                  key="sun"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sun className="w-5 h-5 text-warning" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-dark-bg2 dark:hover:bg-dark-bg2 transition-colors">
            <Bell className="w-5 h-5 text-dark-muted dark:text-dark-muted" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full" />
          </button>

          {/* User Avatar Dropdown */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1 rounded-lg hover:bg-dark-bg2 dark:hover:bg-dark-bg2 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-warning flex items-center justify-center text-dark-bg text-sm font-bold">
                {getInitials(user?.name)}
              </div>
            </button>

            {/* User Dropdown Menu */}
            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-64 bg-dark-bg2 dark:bg-dark-bg2 border border-dark-border dark:border-dark-border rounded-xl shadow-xl overflow-hidden"
                >
                  {/* User Info Header */}
                  <div className="p-4 border-b border-dark-border dark:border-dark-border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-warning flex items-center justify-center text-dark-bg font-bold">
                        {getInitials(user?.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-dark-text dark:text-dark-text truncate">
                          {user?.name}
                        </p>
                        <p className="text-xs text-dark-muted dark:text-dark-muted truncate">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="p-2">
                    <button
                      onClick={() => setShowUserMenu(false)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-dark-bg3 dark:hover:bg-dark-bg3 text-dark-muted dark:text-dark-muted hover:text-dark-text dark:hover:text-dark-text transition-colors text-left"
                    >
                      <div className="w-5 h-5 flex items-center justify-center">
                        <div className="w-3 h-3 rounded border border-dark-muted dark:border-dark-muted" />
                      </div>
                      <span className="text-sm">Set out of office</span>
                    </button>

                    <button
                      onClick={() => {
                        navigate("/dashboard/admin");
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-dark-bg3 dark:hover:bg-dark-bg3 text-dark-muted dark:text-dark-muted hover:text-dark-text dark:hover:text-dark-text transition-colors text-left"
                    >
                      <Settings className="w-5 h-5" />
                      <span className="text-sm">Admin console</span>
                    </button>

                    <button
                      onClick={() => {
                        navigate("/dashboard/workspaces/new");
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-dark-bg3 dark:hover:bg-dark-bg3 text-dark-muted dark:text-dark-muted hover:text-dark-text dark:hover:text-dark-text transition-colors text-left"
                    >
                      <Plus className="w-5 h-5" />
                      <span className="text-sm">New workspace</span>
                    </button>

                    <button
                      onClick={() => {
                        navigate("/dashboard/invite");
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-dark-bg3 dark:hover:bg-dark-bg3 text-dark-muted dark:text-dark-muted hover:text-dark-text dark:hover:text-dark-text transition-colors text-left"
                    >
                      <UserPlus className="w-5 h-5" />
                      <span className="text-sm">Invite to FlowEase</span>
                    </button>
                  </div>

                  <div className="p-2 border-t border-dark-border dark:border-dark-border">
                    <button
                      onClick={() => {
                        navigate("/dashboard/settings/profile");
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-dark-bg3 dark:hover:bg-dark-bg3 text-dark-muted dark:text-dark-muted hover:text-dark-text dark:hover:text-dark-text transition-colors text-left"
                    >
                      <UserIcon className="w-5 h-5" />
                      <span className="text-sm">Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        navigate("/dashboard/settings");
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-dark-bg3 dark:hover:bg-dark-bg3 text-dark-muted dark:text-dark-muted hover:text-dark-text dark:hover:text-dark-text transition-colors text-left"
                    >
                      <Settings className="w-5 h-5" />
                      <span className="text-sm">Settings</span>
                    </button>

                    <button
                      onClick={() => setShowUserMenu(false)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-dark-bg3 dark:hover:bg-dark-bg3 text-dark-muted dark:text-dark-muted hover:text-dark-text dark:hover:text-dark-text transition-colors text-left"
                    >
                      <Plus className="w-5 h-5" />
                      <span className="text-sm">Add another account</span>
                    </button>
                  </div>

                  {/* Logout */}
                  <div className="p-2 border-t border-dark-border dark:border-dark-border">
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-dark-bg3 rounded-lg transition-colors text-left w-full"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">
                        {isLoggingOut ? "Logging out..." : "Logout"}
                      </span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
