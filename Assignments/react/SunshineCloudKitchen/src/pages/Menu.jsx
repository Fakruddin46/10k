import React, { useState, useEffect } from 'react';
import { Star, Plus, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { API_URL } from '../config';
import './Menu.css';

const Menu = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const [addedItemIds, setAddedItemIds] = useState({});

  useEffect(() => {
    // Fetch data from json-server
    const fetchData = async () => {
      try {
        const [menuRes, categoriesRes] = await Promise.all([
          fetch(`${API_URL}/menu`),
          fetch(`${API_URL}/categories`)
        ]);
        
        const menuData = await menuRes.json();
        const categoriesData = await categoriesRes.json();
        
        setItems(menuData);
        setCategories([{ id: 0, name: 'All' }, ...categoriesData]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching menu:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddToCart = (item) => {
    addToCart(item);
    setAddedItemIds({ ...addedItemIds, [item.id]: true });
    setTimeout(() => {
      setAddedItemIds(prev => ({ ...prev, [item.id]: false }));
    }, 2000);
  };

  const filteredItems = activeCategory === 'All' 
    ? items 
    : items.filter(item => item.category === activeCategory);

  if (loading) {
    return <div className="loading">Loading our delicious menu...</div>;
  }

  return (
    <div className="menu-page">
      <div className="menu-header">
        <h1>Our <span className="highlight">Menu</span></h1>
        <p>Explore our wide variety of delicious meals.</p>
      </div>

      <div className="container">
        {/* Category Filter */}
        <div className="categories-filter">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`category-btn ${activeCategory === cat.name ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.name)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="menu-grid">
          {filteredItems.map(item => (
            <div key={item.id} className="menu-card">
              <div className="menu-card-img">
                <img src={item.image} alt={item.name} />
              </div>
              <div className="menu-card-content">
                <div className="menu-card-header">
                  <h3>{item.name}</h3>
                  <span className="price">₹{item.price.toFixed(2)}</span>
                </div>
                <p className="description">{item.description}</p>
                <div className="menu-card-footer">
                  <div className="rating">
                    <Star size={16} fill="var(--secondary-color)" color="var(--secondary-color)" />
                    <span>{item.rating}</span>
                  </div>
                  <button 
                    className={`add-to-cart-btn ${addedItemIds[item.id] ? 'btn-success' : 'btn-primary'}`}
                    onClick={() => handleAddToCart(item)}
                    style={addedItemIds[item.id] ? { backgroundColor: '#28a745', color: 'white' } : {}}
                  >
                    {addedItemIds[item.id] ? <Check size={20} /> : <Plus size={20} />} 
                    {addedItemIds[item.id] ? 'Added' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Menu;
