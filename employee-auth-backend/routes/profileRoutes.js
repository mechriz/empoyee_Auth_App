// routes/profileRoutes.js

const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware');

// Profile setup route
router.post('/setup', authMiddleware, profileController.setupProfile);

// ✅ NEW: Check if user has profile
router.get('/check', authMiddleware, profileController.checkProfileExists);


router.get('/me', authMiddleware, profileController.getMyProfile);


module.exports = router;
