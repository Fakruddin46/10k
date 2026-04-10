import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Clock, MapPin } from 'lucide-react';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <span className="badge">Gourmet Quality</span>
          <h1>Food Delivery, <br /><span className="highlight">Perfected</span></h1>
          <p>Experience the finest culinary delights delivered straight to your door. Fresh ingredients, masterful chefs, and lightning-fast delivery.</p>
          <div className="hero-actions">
            <Link to="/menu" className="btn-primary">
              Order Now <ArrowRight size={20} />
            </Link>
            <Link to="/about" className="btn-outline white-outline">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features container">
        <div className="feature-card">
          <div className="feature-icon"><Clock size={32} /></div>
          <h3>Fast Delivery</h3>
          <p>Hot and fresh to your door within 30 minutes. Satisfaction guaranteed.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon"><Star size={32} /></div>
          <h3>Top Rated Chefs</h3>
          <p>Our meals are prepared by industry professionals with years of experience.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon"><MapPin size={32} /></div>
          <h3>Live Tracking</h3>
          <p>Know exactly where your food is with our real-time order tracking system.</p>
        </div>
      </section>
      
      {/* Short Call to action or popular items teaser could go here */}
    </div>
  );
};

export default Home;
