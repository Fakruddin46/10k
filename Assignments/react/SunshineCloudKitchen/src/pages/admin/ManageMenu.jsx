import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { API_URL } from '../../config';
import './Admin.css';

const ManageMenu = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '', price: '', category: 'Burgers', description: '', image: '/assets/burger.png', rating: 4.5
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [menuRes, catRes] = await Promise.all([
        fetch(`${API_URL}/menu`),
        fetch(`${API_URL}/categories`)
      ]);
      const menuData = await menuRes.json();
      const catData = await catRes.json();
      setItems(menuData);
      setCategories(catData);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'price' || name === 'rating' ? Number(value) : value });
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: '', price: '', category: categories[0]?.name || 'Burgers', description: '', image: '/assets/burger.png', rating: 4.5 });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setFormData(item);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingId ? `${API_URL}/menu/${editingId}` : `${API_URL}/menu`;
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        fetchData();
        closeModal();
      }
    } catch (err) {
      console.error("Error saving item", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this menu item?")) {
      try {
        await fetch(`${API_URL}/menu/${id}`, { method: 'DELETE' });
        fetchData();
      } catch (err) {
        console.error("Error deleting item", err);
      }
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header flex-between">
        <div>
          <h1>Manage Menu</h1>
          <p>Add, edit, or remove items from your live menu.</p>
        </div>
        <button className="btn-primary" onClick={openAddModal}>
          <Plus size={20} /> Add New Item
        </button>
      </div>

      <div className="content-card mt-20">
        {loading ? (
          <p>Loading data...</p>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr><td colSpan="5" style={{textAlign: 'center', padding: '20px'}}>No items found.</td></tr>
                ) : items.map(item => (
                  <tr key={item.id}>
                    <td>
                      <div className="table-img"><img src={item.image} alt={item.name} /></div>
                    </td>
                    <td className="fw-500">{item.name}</td>
                    <td><span className="badge-light">{item.category}</span></td>
                    <td className="fw-700 text-primary">₹{item.price}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="icon-btn text-blue" onClick={() => openEditModal(item)}>
                          <Edit2 size={18} />
                        </button>
                        <button className="icon-btn text-red" onClick={() => handleDelete(item.id)}>
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Flow */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingId ? 'Edit Menu Item' : 'Add New Item'}</h2>
              <button className="icon-btn" onClick={closeModal}><X size={24} /></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-group">
                  <label>Item Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                </div>
                
                <div className="form-group row">
                  <div className="input-field">
                    <label>Price (₹)</label>
                    <input type="number" name="price" value={formData.price} onChange={handleInputChange} required min="1" step="0.01" />
                  </div>
                  <div className="input-field">
                    <label>Category</label>
                    <select name="category" value={formData.category} onChange={handleInputChange} required>
                      {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} required rows="3"></textarea>
                </div>

                <div className="form-group">
                  <label>Image Source (URL or Path)</label>
                  <input type="text" name="image" value={formData.image} onChange={handleInputChange} required />
                  <small style={{color: '#6c757d', display: 'block', marginTop: '5px'}}>Example: /assets/burger.png</small>
                </div>

                <button type="submit" className="btn-primary w-100 mt-20">
                  {editingId ? 'Save Changes' : 'Add Item'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageMenu;
