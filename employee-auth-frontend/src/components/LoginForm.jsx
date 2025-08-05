import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function LoginForm() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      const profileRes = await fetch('http://localhost:5000/api/profile/check', {
        headers: { Authorization: `Bearer ${data.token}` },
      });

      const profileData = await profileRes.json();

      if (!profileData.profileExists) {
        navigate('/profile-setup');
      } else if (data.user.role === 'admin') {
        navigate('/dashboard/admin');
      } else {
        navigate('/dashboard/user');
      }
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    }
  };

  return (
    <div className="page-container">
      <h2>Login – Fortune Technologies Limited</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Login</button>
      </form>
      <p style={{ marginTop: '10px' }}>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}

export default LoginForm;



