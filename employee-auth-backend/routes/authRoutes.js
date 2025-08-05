const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);

router.get('/admin-only', authMiddleware, roleMiddleware('admin'), (req, res) => {
  res.json({ message: `Welcome Admin (User ID: ${req.user.id})` });
});

module.exports = router;
