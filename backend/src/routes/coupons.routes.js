const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const applyCoupon = require('../controllers/coupons.controller');
const router = express.Router();

router.post('/apply', authMiddleware, applyCoupon);

module.exports = router