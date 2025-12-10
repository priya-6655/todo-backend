const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('cloudinary').v2


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
})

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'todo-user-profile',
        resource_type: 'image',
    },
})


const fileFilter = (req, file, cb) => {
    const allowedType = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (allowedType.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error('Only image files (jpg, jpeg, png, webp) are allowed'), false)
    }
}

const uploadProfile = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
})

module.exports = uploadProfile