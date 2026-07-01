const {Product, Reviews, User} = require('../models')
const {Op} = require('sequelize')

const getAllproducts = async (req, res) => {
    try{
        const {category, page = 1, limit = 36, sortBy, query} = req.query; 
        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 12;
        const skip = (pageNum - 1) * limitNum;
        
        
        // for all logical filter
        const where = {
            isActive: true
        }

        if (category) {
            where.categoryId = category 
        }
        if (query) {
            where[Op.or] = [{name: { [Op.iLike]: `%${query}%`}}, {description: { [Op.iLike]: `%${query}%`}}]
        }

        // for sorting 
        const order = []

        if (sortBy) {
            const direction = sortBy === 'price_asc' ? 'ASC' : 'DESC'; // for sorting/order
            order.push(['price', direction]) 
        }

        const {count, rows} = await Product.findAndCountAll({ 
            where, 
            order, 
            offset: skip, 
            limit: limit  
        })

        const response = {
                metadata : {
                    totalItems: count,
                    totalPages: Math.ceil(count / limit),
                    currentPage: parseInt(page, 10) 
                },
                products: rows
            }

        res.status(200).json(response)
    } catch(err) {
        console.error(err)
        res.status(500).json({
            success: false, 
            error: "Internal Server Error!"
        })
    }
}

const getProductById = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findByPk(productId, {
            attributes: ['id', 'name', 'description', 'price', 'image_urls', 'stock'],
            include: [
                {
                    model: Reviews,
                    as: 'reviews',
                    attributes: ['id', 'rating', 'comment', 'createdAt'],
                    include: [
                        {
                            model: User,
                            as: 'user',
                            attributes: ['name']
                        }
                    ]
                }
            ]
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found.'
            });
        }

        // Calculate average rating
        let avgRating = 0;
        if (product.reviews && product.reviews.length > 0) {
            const sum = product.reviews.reduce((acc, r) => acc + r.rating, 0);
            avgRating = parseFloat((sum / product.reviews.length).toFixed(1));
        }

        res.status(200).json({
            success: true,
            product: product,
            avgRating: avgRating
        })
    } catch(error) {
        console.error(error);
        res.status(500).json({
            success: false, 
            error: error.message || error
        })
    }
}

module.exports = { getAllproducts, getProductById};
