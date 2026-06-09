const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const processCheckout = require('../controllers/checkout.controller');
const router = express.Router();

// for checkout 
router.post('/', authMiddleware, processCheckout);

module.exports = router;