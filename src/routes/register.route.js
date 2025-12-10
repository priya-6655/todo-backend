const express = require('express')
const { userReg, userLogin, getUser, editProfile } = require('../controllers/register.controller')
const uploadProfile = require('../middleware/uploadProfile')
const router = express.Router()

router.post('/regUser', userReg)
router.post('/login', userLogin)
router.get('/getuser/:id', getUser)
router.put('/editprofile/:id', uploadProfile.single('image'), editProfile)

module.exports = router