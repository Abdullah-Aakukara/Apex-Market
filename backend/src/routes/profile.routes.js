const express = require('express');
const {getUserProfile, updateUserProfile, changeUserPassword} = require('../controllers/profile.controller.js')
const getImageParser = require('../utils/getImageParser.js');
const authMiddleware = require('../middlewares/auth.middleware.js')

const router = express.Router();
const upload = getImageParser();

// GET user profile
router.get('/', authMiddleware, getUserProfile);

// UPDATE user profile
router.put('/update', authMiddleware, upload.single('profilePicture'), updateUserProfile);

// UPDATE user password
router.patch('/change-password', authMiddleware, changeUserPassword);

module.exports = router;