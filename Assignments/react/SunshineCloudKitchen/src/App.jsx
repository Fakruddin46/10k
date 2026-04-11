import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layouts (Loaded immediately as they wrap the content)
import CustomerLayout from './layouts/CustomerLayout';
import AdminLayout from './layouts/AdminLayout';

// Customer Pages (Lazy Loaded)
const Home = React.lazy(() => import('./pages/Home'));
const Menu = React.lazy(() => import('./pages/Menu'));
const Checkout = React.lazy(() => import('./pages/Checkout'));
const Tracking = React.lazy(() => import('./pages/Tracking'));

// Admin Pages (Lazy Loaded)
const AdminLogin = React.lazy(() => import('./pages/admin/AdminLogin'));
const Dashboard = React.lazy(() => import('./pages/admin/Dashboard'));
const ManageMenu = React.lazy(() => import('./pages/admin/ManageMenu'));
const Orders = React.lazy(() => import('./pages/admin/Orders'));

import './App.css';

// A simple loading fallback 
const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw' }}>
    <h3>Loading...</h3>
  </div>
);

function App() {
  return (
    <Router>
      <div className="App">
        <Suspense fallback={<PageLoader />}>
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
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
