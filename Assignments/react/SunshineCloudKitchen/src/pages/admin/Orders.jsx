import React, { useState, useEffect } from 'react';
import { Eye, Check, X } from 'lucide-react';
import { API_URL } from '../../config';
import './Admin.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/orders`);
      const data = await res.json();
      setOrders(data.reverse()); // Show newest first
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id, newStatus) => {
    try {
      const orderToUpdate = orders.find(o => o.id === id);
      if(!orderToUpdate) return;
      
      const res = await fetch(`${API_URL}/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({...orderToUpdate, status: newStatus})
      });
      if(res.ok) {
        fetchOrders();
        // TRIGGER WHATSAPP
        const message = `*Order Update: ${orderToUpdate.orderId || orderToUpdate.id}*\n\nHello ${orderToUpdate.customer},\n\nYour order from Sunshine Cloud Kitchen is now: *${newStatus}*.\n\nYou can track your order at: https://10k-iota.vercel.app/tracking/${orderToUpdate.orderId || orderToUpdate.id}\n\nThank you!`;
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
      }
    } catch (err) {
      console.error("Error updating order", err);
    }
  };

  const deleteOrder = async (id) => {
    if(window.confirm("Are you sure you want to permanently delete this order?")) {
      try {
        await fetch(`${API_URL}/orders/${id}`, { method: 'DELETE' });
        fetchOrders();
      } catch (err) {
        console.error("Error deleting order", err);
      }
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return '#ffc107'; // yellow
      case 'Preparing': return '#17a2b8'; // blue
      case 'Delivered': return '#28a745'; // green
      case 'Rejected': return '#dc3545'; // red
      default: return '#6c757d';
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Orders Management</h1>
        <p>View and manage mock customer orders.</p>
      </div>

      <div className="content-card mt-40">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items Summary</th>
                <th>Date / Time</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" style={{textAlign: 'center', padding: '20px'}}>Loading orders...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan="7" style={{textAlign: 'center', padding: '20px'}}>No orders received yet.</td></tr>
              ) : orders.map(order => (
                <tr key={order.id}>
                  <td className="fw-700">{order.orderId || order.id}</td>
                  <td className="fw-500">{order.customer}</td>
                  <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {order.items || 'No items'}
                  </td>
                  <td>{order.date || 'Unknown'}</td>
                  <td className="fw-700 text-primary">₹{(order.total || 0).toFixed(2)}</td>
                  <td>
                    <span 
                      className="badge-light" 
                      style={{ 
                        backgroundColor: `${getStatusColor(order.status || 'Pending')}20`, 
                        color: getStatusColor(order.status || 'Pending'),
                        borderColor: `${getStatusColor(order.status || 'Pending')}40`
                      }}
                    >
                      {order.status || 'Pending'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="icon-btn text-blue" title="View Details">
                        <Eye size={18} />
                      </button>
                      {order.status === 'Pending' && (
                        <button className="icon-btn" style={{color: '#28a745'}} title="Accept Order" onClick={() => updateOrderStatus(order.id, 'Preparing')}>
                          <Check size={18} />
                        </button>
                      )}
                      
                      {order.status === 'Preparing' && (
                        <button className="icon-btn" style={{color: '#28a745'}} title="Mark Delivered" onClick={() => updateOrderStatus(order.id, 'Delivered')}>
                          <Check size={18} />
                        </button>
                      )}

                      {(order.status === 'Pending' || order.status === 'Preparing') && (
                        <button className="icon-btn text-red" title="Cancel Order" onClick={() => updateOrderStatus(order.id, 'Rejected')}>
                          <X size={18} />
                        </button>
                      )}

                      <button className="icon-btn" style={{color: '#6c757d', marginLeft: '5px'}} title="Delete Order Log" onClick={() => deleteOrder(order.id)}>
                        <X size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="payment-notice mt-20" style={{padding: '15px', background: '#f8f9fa', borderRadius: '8px', borderLeft: '4px solid var(--primary-color)'}}>
        <p style={{margin: 0, fontWeight: '500'}}>Note: Currently interacting primarily via WhatsApp for immediate processing, but this panel can serve as a tracking log!</p>
      </div>
    </div>
  );
};

export default Orders;
