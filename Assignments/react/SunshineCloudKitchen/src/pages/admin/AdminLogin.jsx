import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import './Admin.css';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Default credentials: admin / sunshine123
    if (credentials.username === 'admin' && credentials.password === 'sunshine123') {
      localStorage.setItem('isAdmin', 'true');
      navigate('/admin');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="admin-login-wrapper" style={{display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f4f6f8'}}>
      <div className="login-card" style={{background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', textAlign: 'center'}}>
        <div style={{background: 'rgba(232, 93, 4, 0.1)', color: 'var(--primary-color)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px'}}>
          <Lock size={30} />
        </div>
        <h2 style={{marginBottom: '10px'}}>Admin Access</h2>
        <p style={{color: '#6c757d', marginBottom: '30px'}}>Please log in to manage your kitchen.</p>
        
        {error && <div style={{color: '#dc3545', background: 'rgba(220, 53, 69, 0.1)', padding: '10px', borderRadius: '6px', marginBottom: '20px'}}>{error}</div>}

        <form onSubmit={handleLogin} className="admin-form" style={{textAlign: 'left'}}>
          <div className="form-group" style={{marginBottom: '20px'}}>
            <label>Username</label>
            <input type="text" 
              value={credentials.username} 
              onChange={e => setCredentials({...credentials, username: e.target.value})} 
              required 
            />
          </div>
          <div className="form-group" style={{marginBottom: '30px'}}>
            <label>Password</label>
            <input type="password" 
              value={credentials.password} 
              onChange={e => setCredentials({...credentials, password: e.target.value})} 
              required 
            />
          </div>
          <button type="submit" className="btn-primary w-100">Login directly to Dashboard</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
