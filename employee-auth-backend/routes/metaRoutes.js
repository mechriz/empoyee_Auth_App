// routes/metaRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all departments
router.get('/departments', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, name FROM departments');
    res.json(rows);
  } catch (err) {
    console.error('Department fetch error:', err);
    res.status(500).json({ message: 'Failed to load departments' });
  }
});

// Get all designations
router.get('/designations', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, name FROM designations');
    res.json(rows);
  } catch (err) {
    console.error('Designation fetch error:', err);
    res.status(500).json({ message: 'Failed to load designations' });
  }
});

module.exports = router;
