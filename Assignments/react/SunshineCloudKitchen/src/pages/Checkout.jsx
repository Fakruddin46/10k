import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle, PhoneCall } from 'lucide-react';
import { API_URL } from '../config';
import './Checkout.css';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', mobile: '', address: '', city: ''
  });

  if (cartItems.length === 0 && !isSuccess) {
    return (
      <div className="checkout-page empty">
        <h2>Your cart is empty</h2>
        <p>You need to add items to your cart before checking out.</p>
        <Link to="/menu" className="btn-primary mt-20">Return to Menu</Link>
      </div>
    );
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const deliveryFee = 49;
    const total = getCartTotal() + deliveryFee;

    // Save order to backend
    const itemsSummary = cartItems.map(i => `${i.quantity}x ${i.name}`).join(', ');
    const newOrder = {
      orderId: 'SCK-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      customer: formData.name,
      email: formData.email,
      mobile: formData.mobile,
      date: new Date().toLocaleString(),
      total: total,
      status: 'Pending',
      items: itemsSummary
    };

    try {
      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      });
      const savedOrder = await res.json();
      
      // ==========================================
      // GOOGLE SHEETS INTEGRATION
      // ==========================================
      // Paste your Google Apps Script Web URL below:
      const GOOGLE_SHEETS_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycby2_JPe_Et01h5_GCnhnZtTC4jZK5WINl6eBTTB1uvtAVww3roB_Eop-j9KoOxJ4_Gw-w/exec";
      
      if(GOOGLE_SHEETS_WEBHOOK_URL.startsWith("https://script.google.com/")) {
        fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
          method: 'POST',
          mode: 'no-cors', // Required to bypass Google's strict CORS policy
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newOrder)
        }).catch(err => console.error("Google Sheets sync failed:", err));
      }
      
      // WhatsApp Message Formatting
      let message = `*New Order from ${formData.name}* \n\n`;
      message += ` *Customer Details:*\n`;
      message += `Name: ${formData.name}\n`;
      message += `Email: ${formData.email}\n`;
      message += `Mobile: ${formData.mobile}\n`;
      message += `Address: ${formData.address}, ${formData.city}\n\n`;
      
      message += ` *Order Details:*\n`;
      cartItems.forEach(item => {
        message += `- ${item.quantity}x ${item.name} (₹${(item.price * item.quantity).toFixed(2)})\n`;
      });
      
      message += `\n *Subtotal*: ₹${getCartTotal().toFixed(2)}\n`;
      message += ` *Delivery*: ₹${deliveryFee.toFixed(2)}\n`;
      message += ` *TOTAL*: ₹${total.toFixed(2)}\n\n`;
      message += `Please confirm my order! `;

      const encodedMessage = encodeURIComponent(message);
      const whatsappNumber = "919494174038"; 
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
      
      window.open(whatsappUrl, '_blank');

      setIsSuccess(true);
      clearCart();
      navigate(`/tracking/${savedOrder.orderId}`); // Redirect here
      
    } catch (err) {
      console.error("Failed to save order to dashboard", err);
    }
  };

  if (isSuccess) {
    return (
      <div className="checkout-page success">
        <div className="success-card">
          <CheckCircle size={80} color="#28a745" />
          <h2>Order Sent via WhatsApp!</h2>
          <p>Thank you for your order, <strong>{formData.name}</strong>.</p>
          <p>We will confirm your order and send payment details on WhatsApp shortly.</p>
          <Link to="/" className="btn-primary mt-20">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page container">
      <div className="checkout-header">
        <h1>Checkout</h1>
      </div>
      
      <div className="checkout-layout">
        <div className="checkout-form-container">
          <form className="checkout-form" onSubmit={handleSubmit}>
            <h3>Delivery Details</h3>
            <div className="form-group row">
              <div className="input-field">
                <label>Full Name</label>
                <input type="text" name="name" required onChange={handleInputChange} />
              </div>
              <div className="input-field">
                <label>Email Address</label>
                <input type="email" name="email" required onChange={handleInputChange} />
              </div>
            </div>
            <div className="form-group">
              <label>WhatsApp Mobile Number</label>
              <input type="tel" name="mobile" required onChange={handleInputChange} placeholder="10-digit number" />
            </div>
            <div className="form-group">
              <label>Delivery Address</label>
              <input type="text" name="address" required onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label>City</label>
              <input type="text" name="city" required onChange={handleInputChange} />
            </div>

            <div className="payment-notice" style={{marginTop: '30px', padding: '15px', background: '#f8f9fa', borderRadius: '8px', borderLeft: '4px solid #25D366'}}>
              <p style={{margin: 0, fontWeight: '500', display: 'flex', alignItems: 'center', gap: '10px'}}>
                <PhoneCall size={20} color="#25D366" />
                This will redirect you to WhatsApp to place the order and facilitate payment.
              </p>
            </div>

            <button type="submit" className="btn-primary place-order-btn mt-20" style={{backgroundColor: '#25D366', color: 'white', border: 'none'}}>
              Place Order via WhatsApp (₹{(getCartTotal() + 49).toFixed(2)})
            </button>
          </form>
        </div>

        <div className="checkout-summary-container">
          <div className="checkout-summary">
            <h3>Order Summary</h3>
            <div className="summary-items">
              {cartItems.map(item => (
                <div key={item.id} className="summary-item">
                  <span className="item-qty">{item.quantity}x</span>
                  <span className="item-name">{item.name}</span>
                  <span className="item-price">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="summary-totals">
              <div className="row">
                <span>Subtotal</span>
                <span>₹{getCartTotal().toFixed(2)}</span>
              </div>
              <div className="row">
                <span>Delivery</span>
                <span>₹49.00</span>
              </div>
              <div className="row total">
                <span>Total</span>
                <span>₹{(getCartTotal() + 49).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
