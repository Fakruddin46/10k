import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CartDrawer from '../components/CartDrawer';

const CustomerLayout = () => {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <main className="main-content">
        <Outlet />
      </main>
    </>
  );
};

export default CustomerLayout;
