import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Menu as MenuIcon } from 'lucide-react';
import AdminSidebar from '../components/admin/AdminSidebar';
import './AdminLayout.css';

const AdminLayout = () => {
  const isAuthenticated = localStorage.getItem('isAdmin') === 'true';
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="admin-layout">
      {isSidebarOpen && <div className="admin-overlay" onClick={toggleSidebar}></div>}
      <AdminSidebar isOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)} />
      <div className="admin-main-wrapper">
        <header className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button className="mobile-menu-btn" onClick={toggleSidebar}>
              <MenuIcon size={24} />
            </button>
            <h2>Admin Dashboard</h2>
          </div>
          <div className="admin-user">Admin User</div>
        </header>
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
