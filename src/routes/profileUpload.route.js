const express = require('express')
const { editProfile } = require('../controllers/register.controller')
const uploadProfile = require('../middleware/uploadProfile')
const router = express.Router()

router.put('/editprofile/:id', uploadProfile.single('image'), editProfile)

module.exports = router