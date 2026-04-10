import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, ChefHat, Truck } from 'lucide-react';
import { API_URL } from '../config';
import './Tracking.css';

const Tracking = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch and poll the backend every 5 seconds to check for admin status updates!
    const fetchOrder = async () => {
      try {
        const res = await fetch(`${API_URL}/orders?orderId=${id}`);
        if(res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setOrder(data[0]);
          } else {
            setOrder(null);
          }
        }
      } catch (err) {
        console.error("Failed to fetch order", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
    const interval = setInterval(fetchOrder, 5000);
    return () => clearInterval(interval);
  }, [id]);

  if (loading) return <div className="tracking-page container"><div className="loading">Tracking your order...</div></div>;
  
  if (!order) return (
    <div className="tracking-page container" style={{textAlign: 'center', paddingTop: '100px'}}>
      <h2>Order Not Found</h2>
      <p>We couldn't track order #{id}. It may have been deleted or the ID is incorrect.</p>
      <Link to="/" className="btn-primary mt-20">Back to Home</Link>
    </div>
  );

  const getStep = () => {
    switch (order.status) {
      case 'Pending': return 1;
      case 'Preparing': return 2;
      case 'Delivered': return 3;
      case 'Rejected': return -1;
      default: return 1;
    }
  };

  const currentStep = getStep();

  return (
    <div className="tracking-page container">
      <div className="tracking-header">
        <h1>Order Tracking</h1>
        <p>Order #{order.orderId || order.id}</p>
      </div>

      <div className="tracking-status-card">
        {currentStep === -1 ? (
          <div className="status-rejected">
            <h2>Order Canceled</h2>
            <p>Your order was canceled by the chef. Please contact support via WhatsApp if this was a mistake.</p>
          </div>
        ) : (
          <div className="stepper-wrapper">
            <div className={`stepper-item ${currentStep >= 1 ? 'completed' : ''}`}>
              <div className="step-counter"><Clock size={24} /></div>
              <div className="step-name">Pending</div>
            </div>
            <div className={`stepper-item ${currentStep >= 2 ? 'completed' : ''}`}>
              <div className="step-counter"><ChefHat size={24} /></div>
              <div className="step-name">Preparing</div>
            </div>
            <div className={`stepper-item ${currentStep >= 3 ? 'completed' : ''}`}>
              <div className="step-counter"><Truck size={24} /></div>
              <div className="step-name">Delivered</div>
            </div>
          </div>
        )}
      </div>

      <div className="tracking-details">
        <h3>Order Details</h3>
        <div className="tracking-meta">
          <p><strong>Customer:</strong> {order.customer}</p>
          <p><strong>Placed on:</strong> {order.date}</p>
        </div>
        
        <div className="tracking-items">
          <h4>Items Ordered:</h4>
          <ul>
            {order.items.split(', ').map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
        
        <div className="tracking-total">
          <h4>Total Amount Paid/Pending</h4>
          <span className="price text-primary">₹{order.total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default Tracking;
