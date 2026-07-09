const {RefreshToken, User, Vendor} = require('../models')
const {generateAccessToken, hashToken} = require('../utils/tokens')

const getNewAccessToken = async (req, res) => {
    const oldRefreshtoken = req.cookies.refreshToken 
    
    if (!oldRefreshtoken) {
        return res.status(401).json({error: "No refresh token provided"})
    }

    const tokenHash = hashToken(oldRefreshtoken)
    const record = await RefreshToken.findOne({
        where: {
            token_hash : tokenHash
        }
    })

    if (!record || record.revoked || record.expires_at < Date.now()) {
        return res.status(401).json({ error: "Invalid refresh token"})
    }

    let payload = {};

    const user = await User.findOne({
        where: {
            id: record.user_id
        }, 
        attributes: ['id', 'email', 'role', 'name']
    })

    const userJson = user.toJSON();

    if (userJson.role.includes('vendor')) {
        const vendor = await Vendor.findOne({
            where: {
                userId: userJson.id
            }, 
            attributes: ['id']
        })

        payload = {
            userEmail: userJson.email,
            userId: userJson.id,
            userRole: userJson.role,
            userName: userJson.name,
            vendorId: vendor.id
        }
    } else {
        payload = {
            userEmail: userJson.email,
            userId: userJson.id,
            userRole: userJson.role,
            userName: userJson.name
        }
    }
  
    const newAccessToken = await generateAccessToken(payload)
    res.status(200).json({newAccessToken})        
}

module.exports = getNewAccessToken;
