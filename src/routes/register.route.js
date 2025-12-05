const express = require('express')
const { userReg, userLogin, getUser } = require('../controllers/register.controller')
const router = express.Router()

router.post('/regUser', userReg)
router.post('/login', userLogin)
router.get('/getuser/:id', getUser)

module.exports = router