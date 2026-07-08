const { where } = require('sequelize')
const {RefreshToken} = require('../models')
const { hashToken } = require('../utils/tokens')
const { path } = require('../app')
const logoutUser = async (req, res) => {
    const token = req.cookies.refreshToken
  
    if (token) {
        await RefreshToken.update({revoked: true}, {
            where: {
                token_hash: hashToken(token)
            }
        })
    }

    res.clearCookie('refreshToken', { path: '/auth'});
    res.status(200).json({success: true})
} 

module.exports = logoutUser;