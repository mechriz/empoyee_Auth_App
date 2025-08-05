// src/pages/ProfileSetup.jsx
import React from 'react';
import Navbar from '../components/Navbar';
import ProfileSetupForm from '../components/ProfileSetupForm';

function ProfileSetup() {
  return (
    <div>
      <Navbar />
      <h2>🛠️ Profile Setup</h2>
      <ProfileSetupForm />
    </div>
  );
}

export default ProfileSetup;
