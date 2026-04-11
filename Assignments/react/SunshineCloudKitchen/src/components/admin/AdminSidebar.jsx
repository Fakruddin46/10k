import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Utensils, ShoppingBag, Settings, LogOut } from 'lucide-react';
import './AdminSidebar.css';

const AdminSidebar = ({ isOpen, closeSidebar }) => {
  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
  };

  return (
    <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-brand">
        <Link to="/">
          Sunshine<br/><span>Admin Panel</span>
        </Link>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/admin" end onClick={closeSidebar} className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>
        <NavLink to="/admin/menu" onClick={closeSidebar} className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Utensils size={20} />
          Manage Menu
        </NavLink>
        <NavLink to="/admin/orders" onClick={closeSidebar} className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <ShoppingBag size={20} />
          Orders
        </NavLink>
        <div className="nav-item disabled">
          <Settings size={20} />
          Settings
        </div>
      </nav>

      <div className="sidebar-footer">
        <Link to="/" onClick={handleLogout} className="nav-item logout">
          <LogOut size={20} />
          Exit to Store
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
