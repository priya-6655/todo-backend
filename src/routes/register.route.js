const express = require('express')
const { userReg, userLogin, getUser, editProfile } = require('../controllers/register.controller')
const uploadProfile = require('../middleware/uploadProfile')
const verifyToken = require('../middleware/authMiddleware')
const router = express.Router()

router.post('/regUser', userReg)
router.post('/login', userLogin)
router.get('/getuser/:id', verifyToken, getUser)
router.put('/editprofile/:id', verifyToken, uploadProfile.single('image'), editProfile)


module.exports = router