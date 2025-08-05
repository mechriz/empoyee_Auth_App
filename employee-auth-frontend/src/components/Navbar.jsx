// src/components/Navbar.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!token || !user) return null;

  return (
    <nav style={{ background: '#f5f5f5', padding: '10px', marginBottom: '20px' }}>
      <span style={{ marginRight: '15px' }}>
        👋 Hello, {user.username} ({user.role})
      </span>
      {user.role === 'user' && (
        <button onClick={() => navigate('/dashboard/user')}>User Dashboard</button>
      )}
      {user.role === 'admin' && (
        <button onClick={() => navigate('/dashboard/admin')}>Admin Dashboard</button>
      )}
      <button style={{ marginLeft: '15px' }} onClick={handleLogout}>Logout</button>
    </nav>
  );
}

export default Navbar;
