const express = require('express')
const {registerRequestValidator, loginRequestValidator} = require('../middlewares/validators.middleware')
const requestOtp = require('../controllers/otp.controller')
const registerUser = require('../controllers/register.controller')
const getNewAccessToken = require('../controllers/refreshToken.controller')
const loginUser = require('../controllers/login.controller')
const logoutUser = require('../controllers/logout.controller')
const verifyOtp = require('../middlewares/otpVerification.middleware')

const router = express.Router();

router.post('/request-otp', registerRequestValidator, requestOtp);
router.post('/register', verifyOtp, registerUser);
router.post('/login', loginRequestValidator, loginUser);
router.post('/refresh', getNewAccessToken) // for getting new access token
router.post('/logout', logoutUser)


module.exports = router;