const express = require('express')
const { contact } = require('../controllers/contact.controller')
const verifyToken = require('../middleware/authMiddleware')
const router = express.Router()


router.post('/contact', verifyToken, contact)

module.exports = router