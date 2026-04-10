import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layouts
import CustomerLayout from './layouts/CustomerLayout';
import AdminLayout from './layouts/AdminLayout';

// Customer Pages
import Home from './pages/Home';
import Menu from './pages/Menu';
import Checkout from './pages/Checkout';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import ManageMenu from './pages/admin/ManageMenu';
import Orders from './pages/admin/Orders';

import Tracking from './pages/Tracking';

import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Customer Routes (Includes standard Navbar and CartDrawer) */}
          <Route path="/" element={<CustomerLayout />}>
            <Route index element={<Home />} />
            <Route path="menu" element={<Menu />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="tracking/:id" element={<Tracking />} />
          </Route>

          {/* Admin Login Route (No Layout Wrapper) */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin Routes (Includes Admin Sidebar and Topbar) */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="menu" element={<ManageMenu />} />
            <Route path="orders" element={<Orders />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
