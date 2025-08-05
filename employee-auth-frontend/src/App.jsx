import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProfileSetup from './pages/ProfileSetup'; // ✅ correct one

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/profile-setup" element={<ProfileSetup />} /> {/* ✅ this includes the form */}
        <Route path="/dashboard/user" element={<UserDashboard />} />
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;




