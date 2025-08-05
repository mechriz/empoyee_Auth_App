import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


function RegisterForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user',
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');

      setMessage('✅ Registered successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    }
  };

  return (
    <div className="auth-container">
      <h1 className="brand-title">Fortune Technologies Limited</h1>
      <div className="form-card">
        <h2>Create Account</h2>
        {message && <p className="message">{message}</p>}

        <form onSubmit={handleSubmit}>
          <input name="username" placeholder="Username" onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} required />

          <select name="role" onChange={handleChange}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <button type="submit">Register</button>
        </form>

        <p className="switch-link">
          Already have an account? <a href="/login">Login here</a>
        </p>
      </div>
    </div>
  );
}

export default RegisterForm;

