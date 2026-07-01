const {User} = require('../models');
const bcrypt = require('bcrypt')

// fetches user profile
const fetchUserProfile = async (userId) => { 
    try {
        const user = await User.findByPk(userId, {attributes: ['name', 'email', 'phone', 'avatarUrl']});
        if (!user) {
            const error = new Error('User not found')
            error.type = "USER NOT FOUND"
            throw error
        }
        return user
    } catch (err) {
        console.log(err)
        throw err
    }
}

// updates user profile in DB
const updateProfile = async (userDetail, userId) => { 
    try {
        const [affectedRow] = await User.update(userDetail, {where: {
        id: userId
    }});

    if (!affectedRow) {
        return false
    } else {
        return true
    }
    } catch (err) {
        console.error(err)
        throw err
    }
}

// updates User's Account password
const changePassword = async(oldPassword, newPassword, userId) => {
    try {
        // first of all, find whether the user is authorized to change password
        const user = await User.findByPk(userId, { attributes: ['id', 'passwordHash']})

        if (!user) {
            const error = new Error('User not found!')
            error.status = 404
            throw error
        }

            const isPassValid = await bcrypt.compare(oldPassword, user.passwordHash)
    
            if (!isPassValid) {
                const error = new Error('Invalid credentials')
                error.status = 401
                throw error
            }
    
            // if pass valid, encrypt it and then update 
            const saltRounds = 10;
            const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);
    
            // update password
            await user.update({passwordHash: newPasswordHash})
            return true

    } catch (err) {
        throw err;
    }
}

module.exports = {fetchUserProfile, updateProfile, changePassword};