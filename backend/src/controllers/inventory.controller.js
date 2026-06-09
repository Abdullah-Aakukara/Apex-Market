const {Product, Vendor, Category} = require('../models');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const uploadToCloudinary = require('../utils/uploadToCloudinary');



const addProduct = async (req, res) => {
    try {
        // upload the image buffer to cloudinary and store the image url
        const imageUrl = await uploadToCloudinary(req.file.buffer);
    
        // store the image url and details of product into db
        const newProduct = await Product.create({
            vendorId: req.user.vendorId,
            categoryId: req.body.categoryId, 
            name: req.body.productName, 
            description: req.body.productDescription, 
            price: req.body.productPrice, 
            stock: req.body.productStock,
            imageUrl: imageUrl 
        })

        res.status(201).json({
            success: true,
            product_detail: newProduct.toJSON()  
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({
            error: "Internal Server Error!"
        })
    }
} 

module.exports = addProduct

