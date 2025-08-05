// src/components/Layout.jsx
import React from 'react';
import Navbar from './Navbar';
import './Layout.css'; // We'll create this for styling

function Layout({ children }) {
  return (
    <div className="layout">
      <header className="header">
        <h1>Fortune Technologies Limited</h1>
      </header>
      <Navbar />
      <main className="content">{children}</main>
    </div>
  );
}

export default Layout;
