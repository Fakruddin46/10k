import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, ShoppingBag, DollarSign } from 'lucide-react';
import { API_URL } from '../../config';
import './Admin.css';

const Dashboard = () => {
  const [stats, setStats] = useState({ items: 0 });

  useEffect(() => {
    fetch(`${API_URL}/menu`)
      .then(res => res.json())
      .then(data => setStats({ items: data.length }))
      .catch(err => console.error("Error fetching stats", err));
  }, []);

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Dashboard Overview</h1>
        <p>Welcome back! Here's what's happening today.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{backgroundColor: 'rgba(232, 93, 4, 0.1)', color: 'var(--primary-color)'}}>
            <ShoppingBag size={24} />
          </div>
          <div className="stat-details">
            <h3>Menu Items</h3>
            <p className="stat-value">{stats.items}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{backgroundColor: 'rgba(40, 167, 69, 0.1)', color: '#28a745'}}>
            <DollarSign size={24} />
          </div>
          <div className="stat-details">
            <h3>Total Revenue</h3>
            <p className="stat-value">₹45,850</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{backgroundColor: 'rgba(0, 123, 255, 0.1)', color: '#007bff'}}>
            <Users size={24} />
          </div>
          <div className="stat-details">
            <h3>Active Customers</h3>
            <p className="stat-value">124</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{backgroundColor: 'rgba(255, 193, 7, 0.1)', color: '#ffc107'}}>
            <TrendingUp size={24} />
          </div>
          <div className="stat-details">
            <h3>Growth</h3>
            <p className="stat-value">+15.4%</p>
          </div>
        </div>
      </div>
      
      <div className="dashboard-content mt-40">
        <div className="content-card">
          <h3>Recent Orders (Simulated)</h3>
          <p>This area can display a live feed of WhatsApp orders or backend orders in the future.</p>
          <div className="empty-state mt-20">
            No recent orders.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
