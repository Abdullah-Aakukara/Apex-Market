const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const {addToWishlist, removeFromWishlist, getAllWishes} = require('../controllers/wishlist.controller');
const router = express.Router();

// add to wishlist
router.post('/add/:productId', authMiddleware, addToWishlist)

// remove from wishlist
router.delete('/remove/:productId', authMiddleware, removeFromWishlist)

// get all wishlist items
router.get('/', authMiddleware, getAllWishes)

module.exports = router;