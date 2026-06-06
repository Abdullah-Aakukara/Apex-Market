const express = require('express')
const {registerRequestValidator, loginRequestValidator} = require('../middlewares/validators.middleware')
const registerUser = require('../controllers/register.controller')
const loginUser = require('../controllers/login.controller')

const router = express.Router();

router.post('/register', registerRequestValidator, registerUser);
router.post('/login', loginRequestValidator, loginUser);



module.exports = router;