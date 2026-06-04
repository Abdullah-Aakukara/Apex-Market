const {body, validationResult} = require('express-validator');

const registerRequestValidator = [
    body('name').isString().withMessage('Please provide your Full Name').escape().trim(), 
    body('email').isEmail().withMessage('Please provide a valid email').trim(), 
    body('password').isLength({min: 5}).withMessage('Password must be at least 5 characters'), 
    body('role').isString().withMessage('Role not defined').trim(),
    // conditional validation - only for vendors
    body('storeName').if(body('role').equals('vendor'))
    .isString().withMessage('Please provide your Store/Business Name').escape().trim(),
    body('businessAddress').if(body('role').equals('vendor')).isString().withMessage('Please provide your Store/Business Address').escape().trim(),
    body('phoneNumber').if(body('role').equals('vendor')).isLength({min: 10, max: 10}).withMessage('Please provide a valid 10-digit Business Phone Number'),
    (req, res, next) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            console.error(result.array)
            return res.status(400).json({
                error: result.array()
            })
        }
        next();
    }
]


const loginRequestValidator = [
    body('email').isEmail().withMessage('Please provide a valid email').trim(), 
    body('password').isLength({min: 5}).withMessage('Password must be at least 5 characters'), 
    (req, res, next) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            console.error(result.array)
            return res.status(400).json({
                error: result.array()
            })
        }
        next();
    }
]




module.exports = {registerRequestValidator, loginRequestValidator};