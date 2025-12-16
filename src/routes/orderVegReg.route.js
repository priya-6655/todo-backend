const express = require('express')
const { userReg, usrLogin, vegLogout } = require('../controllers/orderVeg.contoller')
const verifyToken = require('../middleware/authMiddleware')
const router = express.Router()

router.post('/vegorderReg', userReg)
router.post('/vegorderLogin', usrLogin)
router.post('/logout', verifyToken, vegLogout)

module.exports = router