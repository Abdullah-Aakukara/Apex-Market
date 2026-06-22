const {Coupon} = require('../models')
const applyCoupon = async (req, res) => {
    try {
        const {couponCode = '', cartTotal = NaN} = req.body || {};
        if(!couponCode || couponCode.trim() === '' || typeof(couponCode) !== 'string' || typeof(cartTotal) !== 'number')  {
            return res.status(400).json( { error: "Valid Coupon Code and Cart amount required!"})
        }
        //Calculate discount, if coupon code is valid
        const coupon = await Coupon.findOne({
                    where: {
                        code: couponCode
                    }
                })

                // check if coupen is valid and active, not expired, not reached usage limit 
                if(!coupon || (coupon.minOrderAmount > cartTotal) || !coupon.isActive || !(coupon.expiresAt > Date.now()) || !(coupon.usedCount < coupon.usageLimit)) {
                    return res.status(403).json({ error: "Provided Coupon Code isn\'t applicable"})
                }

                // calculate discount
                const discountedAmount = (cartTotal * coupon.value) / 100 

                res.status(200).json( {
                    success: true,
                    couponId: coupon.id,
                    minCartTotal: coupon.minOrderAmount,  
                    discountedAmount: discountedAmount > coupon.maxDiscount ? coupon.maxDiscount:discountedAmount  // if discount amount is greater than max discount, then give max discount, instead of actual
                })
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "internal server error"})
    }
    
}

module.exports = applyCoupon;

