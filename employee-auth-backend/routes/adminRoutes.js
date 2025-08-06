// File: server/routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// ✅ Get users (admin + superadmin)
router.get('/users', authMiddleware, roleMiddleware(['admin', 'superadmin']), async (req, res) => {
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

// ✅ Update a user (admin + superadmin)
router.put('/users/:id', authMiddleware, roleMiddleware(['admin', 'superadmin']), async (req, res) => {
  const userId = req.params.id;
  const { username, email, role } = req.body;

  try {
    const [targetUser] = await db.query('SELECT role FROM users WHERE id = ?', [userId]);

    if (!targetUser.length) {
      return res.status(404).json({ message: 'User not found' });
    }

    const targetRole = targetUser[0].role;

    // 🚫 Admins cannot update other admins or superadmins
    if (req.user.role !== 'superadmin' && (targetRole === 'admin' || targetRole === 'superadmin')) {
      return res.status(403).json({ message: 'Only superadmin can update admin/superadmin users' });
    }

    // 🚫 Only superadmin can assign "admin" or "superadmin" roles
    if (role && (role === 'admin' || role === 'superadmin') && req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Only superadmin can assign admin/superadmin roles' });
    }

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

    if (!fields.length) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    values.push(userId);

    const [result] = await db.query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    res.json({ message: 'User updated successfully' });
  } catch (err) {
    console.error('Update user error:', err);
    res.status(500).json({ message: 'Server error updating user' });
  }
});

// ✅ Delete a user (admin + superadmin)
router.delete('/users/:id', authMiddleware, roleMiddleware(['admin', 'superadmin']), async (req, res) => {
  const userId = req.params.id;

  try {
    const [targetUser] = await db.query('SELECT role FROM users WHERE id = ?', [userId]);

    if (!targetUser.length) {
      return res.status(404).json({ message: 'User not found' });
    }

    const targetRole = targetUser[0].role;

    // 🚫 Only superadmin can delete admins
    if (targetRole === 'admin' && req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Only superadmin can delete admins' });
    }

    // 🚫 No one can delete superadmins
    if (targetRole === 'superadmin') {
      return res.status(403).json({ message: 'Superadmins cannot be deleted' });
    }

    const [result] = await db.query('DELETE FROM users WHERE id = ?', [userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not deleted' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ message: 'Server error deleting user' });
  }
});

module.exports = router;
