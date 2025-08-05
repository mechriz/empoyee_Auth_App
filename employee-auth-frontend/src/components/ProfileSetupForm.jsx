import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

function ProfileSetupForm() {
  const [formData, setFormData] = useState({
    full_name: '',
    department: '',
    designation: '',
    date_joined: '',
  });

  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [message, setMessage] = useState('');

  // Fetch departments & designations
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const token = localStorage.getItem('token');
        const [depRes, desRes] = await Promise.all([
          fetch('http://localhost:5000/api/meta/departments', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('http://localhost:5000/api/meta/designations', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const depData = await depRes.json();
        const desData = await desRes.json();

        setDepartments(depData);
        setDesignations(desData);
      } catch (err) {
        console.error('Meta fetch error:', err);
        setMessage('❌ Failed to load form data');
      }
    };

    fetchMeta();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/profile/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Profile setup failed');

      setMessage('✅ Profile setup complete!');
      const user = JSON.parse(localStorage.getItem('user'));

      // Redirect based on role
      if (user.role === 'admin') {
        window.location.href = '/dashboard/admin';
      } else {
        window.location.href = '/dashboard/user';
      }
    } catch (err) {
      console.error('Submit error:', err);
      setMessage(`❌ ${err.message}`);
    }
  };

  return (
    <div>
      <h2>Profile Setup</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          name="full_name"
          placeholder="Full Name"
          value={formData.full_name}
          onChange={handleChange}
          required
        />

        <select
          name="department"
          value={formData.department}
          onChange={handleChange}
          required
        >
          <option value="">Select Department</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        <select
          name="designation"
          value={formData.designation}
          onChange={handleChange}
          required
        >
          <option value="">Select Designation</option>
          {designations.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        <input
          name="date_joined"
          type="date"
          value={formData.date_joined}
          onChange={handleChange}
          required
        />

        <button type="submit">Submit Profile</button>
      </form>
    </div>
  );
}

export default ProfileSetupForm;


