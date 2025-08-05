const db = require('../db');

exports.setupProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { department, designation, date_joined, full_name } = req.body;

    const [existing] = await db.query('SELECT COUNT(*) AS count FROM employee_profiles');
    const count = existing[0].count + 1;
    const employee_id = `EMP-${1000 + count}`;

    await db.query(
      'INSERT INTO employee_profiles (user_id, employee_id, department, designation, date_joined, full_name) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, employee_id, department, designation, date_joined, full_name]
    );

    res.status(201).json({ message: 'Profile setup successful', employee_id });
  } catch (err) {
    console.error('Profile setup error:', err);
    res.status(500).json({ message: 'Server error during profile setup' });
  }
};

// ✅ Add this new route handler below setupProfile
exports.checkProfileExists = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.query('SELECT id FROM employee_profiles WHERE user_id = ?', [userId]);
    const profileExists = rows.length > 0;

    res.json({ profileExists });
  } catch (err) {
    console.error('Profile check error:', err);
    res.status(500).json({ message: 'Server error checking profile' });
  }
};

exports.getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.query(
      `SELECT ep.*, d.name AS department_name, des.name AS designation_name
       FROM employee_profiles ep
       JOIN departments d ON ep.department = d.id
       JOIN designations des ON ep.designation = des.id
       WHERE ep.user_id = ?`,
      [userId]
    );

    if (!rows.length) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
};



