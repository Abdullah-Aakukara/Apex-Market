const express = require('express')
const getImageParser = require('../utils/getImageParser')
const {addProductRequestValidator} = require('../middlewares/validators.middleware');
const authMiddleware = require('../middlewares/auth.middleware');
const {addProduct, viewInventory, updateProduct, deleteOrRestoreProduct} = require('../controllers/inventory.controller');
const router = express.Router();

const upload = getImageParser();

// Add a new product (requires auth so req.user.vendorId must be available)
router.post('/products/add', authMiddleware, upload.array('imageFiles', 5), addProductRequestValidator, addProduct);

// View Inventory
router.get('/products', authMiddleware, viewInventory);

// Update a Product (Stock)
router.patch('/products/update', upload.array('imageFiles', 5), authMiddleware, updateProduct);

// Delete or restore product 
router.delete('/products/remove', authMiddleware, deleteOrRestoreProduct);

module.exports = router
