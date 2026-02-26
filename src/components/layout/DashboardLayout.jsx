import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import MobileSidebar from './MobileSidebar';
import { useUIStore } from '../../store/uiStore';

const DashboardLayout = () => {
  const { isSidebarOpen, isMobileMenuOpen } = useUIStore();

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Sidebar */}
      <MobileSidebar />

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
        }`}
      >
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => useUIStore.getState().closeMobileMenu()}
        />
      )}
    </div>
  );
};

export default DashboardLayout;