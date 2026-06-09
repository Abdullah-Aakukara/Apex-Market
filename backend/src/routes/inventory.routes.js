const express = require('express')
const multer = require('multer');
const {addProductRequestValidator} = require('../middlewares/validators.middleware');
const authMiddleware = require('../middlewares/auth.middleware');
const addProduct = require('../controllers/inventory.controller');
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage, 
    limits: {
        fileSize: 5 * 1024 * 1024 // max 5 MB
    }
}) 

// Add a new product (requires auth so req.user.vendorId is available)
router.post('/products/add', authMiddleware, upload.single('imageFile'), addProductRequestValidator, addProduct);

module.exports = router
