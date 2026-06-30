const {User} = require('../models')
const {fetchUserProfile, updateProfile, changePassword} = require('../services/profile.service.js')
const uploadToCloudinary = require('../utils/uploadToCloudinary.js')

// GET Profile
const getUserProfile = async (req, res) => {
    try {
        const userProfile = await fetchUserProfile(req.user.userId)
        res.status(200).json({ success: true, userProfile })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: err.message})
    }
} 

// UPDATE Profile
const updateUserProfile = async (req, res) => {

    // continue validating the client's payload, then pack it into object and then call the service funciton
    try {
        const {name, phone} = req.body;
       

        const newUserProfile = {}

        if (name && name.trim() !== '' && typeof(name) === 'string') {
            newUserProfile.name = name
        }

        if (phone && phone.trim() !== '' && typeof(phone) === 'string') {
            newUserProfile.phone = phone 
        }

        if (req.file) {
            const allowedFiles = ['image/jpeg', 'image/png', 'image/webp'];
            const isValid = allowedFiles.includes(req.file.mimetype)
            if (!isValid) {
                return res.status(400).json({ success: false, error: "Image file must have valid extension"})
            }
            // upload profile picture to cloudinary
            const avatarUrl = await uploadToCloudinary(req.file.buffer)
            newUserProfile.avatarUrl = avatarUrl
        }
        
        const updated = await updateProfile(newUserProfile, req.user.userId) // call service function

        if (!updated) {
            return res.status(404).json({ success: false, error: "User not found or Access Denied!"})
        }        
        
        res.status(200).json({ success: true, msg: "Your profile has been updated successfully!"})

    } catch(err) {
        console.error(err.stack)
        res.status(500).json({success: false, error: "Internal Server Error"})
    }
}

// UPDATE user password
const changeUserPassword = async (req, res) => {
    const {currentPassword, newPassword, confirmPassword} = req.body

    if (!currentPassword || currentPassword.trim() === '' && typeof(currentPassword) !== 'string') {
        res.status(400).json({ error: 'Valid current password required!'})
    }

    if (!newPassword || newPassword.trim() === '' && typeof(newPassword) !== 'string') {
        res.status(400).json({ error: 'Valid new password required!'})
    }

    if (!confirmPassword || confirmPassword.trim() === '' && typeof(confirmPassword) !== 'string') {
        res.status(400).json({ error: 'Valid confirm password required!'})
    }

    try {
        await changePassword(currentPassword, newPassword, req.user.userId) 
        res.status(200).json({ success: true, msg: "Your password has been succussfully changed!"})
    } catch (err) {
        if (err.status === 404) {
            console.error(err)
            return res.status(403).json({ success: false, msg: "Unauthorized"})
        }

        if (err.status === 401) {
            console.error(err) 
            return res.status(401).json({ success: false, msg: "Invalid Credentials"})
        }
        console.log(err)
        res.status(500).json({ error: "Internal server error"})
    }
}

module.exports = {getUserProfile, updateUserProfile, changeUserPassword};