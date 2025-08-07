// File: server/routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// ✅ Get users (admin + superadmin) with optional search — includes designation and department
router.get('/users', authMiddleware, roleMiddleware(['admin', 'superadmin']), async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const search = req.query.search ? `%${req.query.search}%` : null;

  try {
    let users, countResult;

    if (search) {
      [users] = await db.query(
        `SELECT u.id, u.username, u.email, u.role,
                d.name AS department,
                des.name AS designation
         FROM users u
         LEFT JOIN employee_profiles ep ON u.id = ep.user_id
         LEFT JOIN departments d ON ep.department = d.id
         LEFT JOIN designations des ON ep.designation = des.id
         WHERE u.username LIKE ? OR u.email LIKE ?
         LIMIT ? OFFSET ?`,
        [search, search, limit, offset]
      );

      [countResult] = await db.query(
        `SELECT COUNT(*) as total
         FROM users u
         WHERE u.username LIKE ? OR u.email LIKE ?`,
        [search, search]
      );
    } else {
      [users] = await db.query(
        `SELECT u.id, u.username, u.email, u.role,
                d.name AS department,
                des.name AS designation
         FROM users u
         LEFT JOIN employee_profiles ep ON u.id = ep.user_id
         LEFT JOIN departments d ON ep.department = d.id
         LEFT JOIN designations des ON ep.designation = des.id
         LIMIT ? OFFSET ?`,
        [limit, offset]
      );

      [countResult] = await db.query('SELECT COUNT(*) as total FROM users');
    }

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


 router.put('/users/:id', authMiddleware, roleMiddleware(['admin', 'superadmin']), async (req, res) => {
  const userId = req.params.id;
  const { username, email, role, department, designation } = req.body;

  try {
    const [targetUser] = await db.query('SELECT role FROM users WHERE id = ?', [userId]);

    if (!targetUser.length) {
      return res.status(404).json({ message: 'User not found' });
    }

    const targetRole = targetUser[0].role;

    // 🚫 Admins cannot update other admins or superadmins
    if (
      req.user.role !== 'superadmin' &&
      (targetRole === 'admin' || targetRole === 'superadmin')
    ) {
      return res.status(403).json({ message: 'Only superadmin can update admin/superadmin users' });
    }

    // 🚫 Only superadmin can assign "admin" or "superadmin" roles
    if (role && (role === 'admin' || role === 'superadmin') && req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Only superadmin can assign admin/superadmin roles' });
    }

    // ✅ 1. Update users table
    const userFields = [];
    const userValues = [];

    if (username) {
      userFields.push('username = ?');
      userValues.push(username);
    }
    if (email) {
      userFields.push('email = ?');
      userValues.push(email);
    }
    if (role) {
      userFields.push('role = ?');
      userValues.push(role);
    }

    if (userFields.length) {
      userValues.push(userId);
      await db.query(
        `UPDATE users SET ${userFields.join(', ')} WHERE id = ?`,
        userValues
      );
    }

    // ✅ 2. Update employee_profiles table
    const profileFields = [];
    const profileValues = [];

    // Convert department and designation to integers or null
    const deptId = department ? parseInt(department) : null;
    const desigId = designation ? parseInt(designation) : null;

    if (department !== undefined) {
      profileFields.push('department = ?');
      profileValues.push(deptId);
    }
    if (designation !== undefined) {
      profileFields.push('designation = ?');
      profileValues.push(desigId);
    }

    if (profileFields.length) {
      profileValues.push(userId);
      const [existingProfile] = await db.query('SELECT * FROM employee_profiles WHERE user_id = ?', [userId]);

      if (existingProfile.length > 0) {
        // Update existing profile
        await db.query(
          `UPDATE employee_profiles SET ${profileFields.join(', ')} WHERE user_id = ?`,
          profileValues
        );
      } else {
        // Create new profile if not exists
        await db.query(
          `INSERT INTO employee_profiles (department, designation, user_id) VALUES (?, ?, ?)`,
          [deptId, desigId, userId]
        );
      }
    }

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

// Get all departments
router.get('/departments', authMiddleware, roleMiddleware(['admin', 'superadmin']), async (req, res) => {
  try {
    const [departments] = await db.query('SELECT id, name FROM departments');
    res.json(departments);
  } catch (err) {
    console.error('Fetch departments error:', err);
    res.status(500).json({ message: 'Server error fetching departments' });
  }
});

// Get all designations
router.get('/designations', authMiddleware, roleMiddleware(['admin', 'superadmin']), async (req, res) => {
  try {
    const [designations] = await db.query('SELECT id, name FROM designations');
    res.json(designations);
  } catch (err) {
    console.error('Fetch designations error:', err);
    res.status(500).json({ message: 'Server error fetching designations' });
  }
});


module.exports = router;
