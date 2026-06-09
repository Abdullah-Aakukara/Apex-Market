const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const {getAllproducts, getProductById} = require('../controllers/products.controller'); // controller functions
const router = express.Router();


// GET all products
router.get('/', getAllproducts);
router.get('/:id', getProductById);


module.exports = router;
