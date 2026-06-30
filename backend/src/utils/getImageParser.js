const multer = require('multer')

const getImageParser = () => {
    const storage = multer.memoryStorage();
    const upload = multer({
        storage: storage, 
        limits: {
            fileSize: 5 * 1024 * 1024 // max 5 MB
        }
    })

    return upload
}

module.exports = getImageParser;
