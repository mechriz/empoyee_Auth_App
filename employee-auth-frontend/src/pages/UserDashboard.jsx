import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function UserDashboard() {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/profile/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          localStorage.clear();
          navigate('/login');
        }

        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div>
      <Navbar /> {/* ✅ This line adds the navigation bar */}
      <h2>👋 Welcome, {profile.full_name}</h2>
      <p><strong>Employee ID:</strong> {profile.employee_id}</p>
      <p><strong>Department:</strong> {profile.department_name}</p>
      <p><strong>Designation:</strong> {profile.designation_name}</p>
      <p><strong>Date Joined:</strong> {new Date(profile.date_joined).toDateString()}</p>
    </div>
  );
}

export default UserDashboard;

