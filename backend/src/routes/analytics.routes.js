const express = require('express');
const {getAnalytics, updateOrderStatus} = require('../controllers/analytics.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const router = express.Router()

router.get('/orders', authMiddleware, getAnalytics);
router.patch('/orders/:id/status', authMiddleware, updateOrderStatus)
module.exports = router;