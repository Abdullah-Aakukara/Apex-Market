const express = require('express');
const authMiddleware = require("../middlewares/auth.middleware");
const postReview = require('../controllers/reviews.controller');

const router = express.Router();

router.post('/product/:id', authMiddleware, postReview);

module.exports = router;