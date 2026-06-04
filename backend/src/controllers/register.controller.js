const jwt = require('jsonwebtoken');
const sequelize = require('../db/dbConfig');
const { User, Vendor } = require('../models');
const path = require('path');
const bcrypt = require('bcrypt');
require('dotenv').config({path: path.resolve(__dirname, '../../.env')})

const JWT_SECRET = process.env.JWT_SECRET;

const registerUser = async (req, res) => {
    const {name, email, password, role, storeName, businessAddress, phoneNumber} = req.body;
    let newUser = {}
    try {
        const doesExist = await User.findOne({
            where: {
                email: email
            }
        });

        if (doesExist) {
            if (doesExist.toJSON().role === role) {
                return res.status(409).json({
                    error: "Account already registered with this role"
                })
            }


        }

        const passwordHash = await bcrypt.hash(password, 10);

        if(role === 'customer') {
            newUser = await User.create({
                name: name, 
                email: email, 
                passwordHash: passwordHash
            })

            res.status(201).json( {
                message: "User successfully registered!",
                user: newUser
            })
        } else {
            newUser = await User.create({
                name: name, 
                email: email, 
                passwordHash: passwordHash, 
                role: role
            }) 

            const newVendor = await Vendor.create({
                userId: newUser.toJSON().id, 
                storeName: storeName, 
                storeAddress: businessAddress, 
                phone: phoneNumber
            })

            const vendor = Object.assign(newUser, newVendor);
            res.status(201).json({
                message: "Your Business has been successfully registered! ",
                details: vendor
            })
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Internal server error!"
        })
    }
}

module.exports = registerUser