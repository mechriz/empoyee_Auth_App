// File: server/routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// ✅ Get paginated list of users (admin only)
router.get('/users', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const [users] = await db.query(
      'SELECT id, username, email, role FROM users LIMIT ? OFFSET ?',
      [limit, offset]
    );
    const [countResult] = await db.query('SELECT COUNT(*) as total FROM users');

    res.json({
      users,
      total: countResult[0].total,
      page,
      totalPages: Math.ceil(countResult[0].total / limit),
    });
  } catch (err) {
    console.error('Fetch users error:', err);
    res.status(500).json({ message: 'Server error fetching users' });
  }
});

// ✅ Update a user (admin only) - Partial update
router.put('/users/:id', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  const userId = req.params.id;
  const { username, email, role } = req.body;

  if (!username && !email && !role) {
    return res.status(400).json({ message: 'No fields to update' });
  }

  try {
    const fields = [];
    const values = [];

    if (username) {
      fields.push('username = ?');
      values.push(username);
    }
    if (email) {
      fields.push('email = ?');
      values.push(email);
    }
    if (role) {
      fields.push('role = ?');
      values.push(role);
    }

    values.push(userId);

    const [result] = await db.query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found or no changes made' });
    }

    res.json({ message: 'User updated successfully' });
  } catch (err) {
    console.error('Update user error:', err);
    res.status(500).json({ message: 'Server error updating user' });
  }
});

// ✅ Delete a user (admin only)
router.delete('/users/:id', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  const userId = req.params.id;

  try {
    const [result] = await db.query('DELETE FROM users WHERE id = ?', [userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ message: 'Server error deleting user' });
  }
});

module.exports = router;
