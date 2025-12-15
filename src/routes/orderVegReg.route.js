const express = require('express')
const { userReg } = require('../controllers/orderVeg.contoller')
const router = express.Router()

router.post('/vegorderReg', userReg)

module.exports = router