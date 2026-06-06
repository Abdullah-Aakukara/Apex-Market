const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

const uploadToCloudinary = async (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({
            folder: 'product_images'
        }, (error, result) => {
            if (error) return reject(error)
            resolve(result.secure_url)
        })
        // convert  the binary data into readable streams and pipe it to cloudinary 
        streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    })
}

module.exports = uploadToCloudinary
