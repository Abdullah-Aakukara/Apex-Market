//helper functions for access & refresh token generation
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET 

const generateAccessToken = async (user) => {
    try {
        const accessToken = await jwt.sign(user, process.env.JWT_SECRET, {
            expiresIn: '15m'
        })
        return accessToken
    } catch (err) {
        err.type = "JWT_SIGN_ERROR"
        throw err
    }
}

const generateRefreshToken = () => {
    return crypto.randomBytes(40).toString('hex');
} 

const hashToken = (token) => {
    return crypto.createHash('sha256').update(token).digest('hex');
}

module.exports = {generateAccessToken, generateRefreshToken, hashToken}
