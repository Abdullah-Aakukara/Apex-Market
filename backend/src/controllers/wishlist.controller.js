const { Wishlist, Product } = require('../models')

const addToWishlist = async (req, res) => {

    const user_id = req.user.userId;
    const product_id = req.params.productId
    try {
        await Wishlist.create({ user_id, product_id })
        res.status(201).json({ msg: "Product added to wishlist" })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Internal server error" })
    }
}

const removeFromWishlist = async (req, res) => {
    const user_id = req.user.userId;
    const product_id = req.params.productId;

    try {
        const wish = await Wishlist.findOne({
            where: {
                product_id,
                user_id
            }
        });

        if (wish) {
            await wish.destroy();
        }
        res.status(200).json({ msg: "Product removed from wishlist" });
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Internal server error" })
    }
}

const getAllWishes = async (req, res) => {
    const user_id = req.user.userId;
    const wishes = await Wishlist.findAll({
        where: { user_id }
    })

    let wishedItems = []

    for (const wish of wishes) {
        const product = await Product.findByPk(wish.product_id)
        wishedItems.push(product)
    }

    res.status(200).json({ wishlist: wishedItems });
}

module.exports = { addToWishlist, removeFromWishlist, getAllWishes }