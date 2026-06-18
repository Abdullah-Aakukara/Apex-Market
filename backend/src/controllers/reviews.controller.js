const { Reviews} = require('../models')

const postReview = async (req, res) => {
    const productId = req.params.id
    const userId = req.user.userId
    const productRating = req.body?.productRating
    const reviewComment = req.body?.reviewComment
    
    if(!productRating && productRating === NaN) {
        return res.status(400).json({ error: "Product Rating must be required"})
    }

    if(!reviewComment && reviewComment.trim() === '') {
        return res.status(400).json({ error: "Provide valid Product Review"})
    }
    
    try {
        const productReview = {
                product_id: productId,
                user_id: userId,
                rating: productRating,
                comment: reviewComment 
            }

        await Reviews.create(productReview);

        res.status(201).json({ success: true, msg: "Review submitted successfully"})
        
    } catch (err) {
        console.error(err)
        res.status(500).json( { error: "internal server error"})
    }
}

module.exports = postReview