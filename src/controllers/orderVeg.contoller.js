const OrderVegRegister = require('../model/orderVegReg.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const userReg = async (req, res) => {
    try {
        const { name, email, phone, password, retypePass } = req.body

        if (!name || !email || !phone || !password || !retypePass) {
            return res.status(400).json({
                message: 'All fields are required!'
            })
        }
        if (password !== retypePass) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPass = await bcrypt.hash(password, salt)

        const existEmail = await OrderVegRegister.findOne({ where: { email } })

        if (existEmail) {
            return res.status(400).json({
                message: "Email already registered!"
            })
        }

        const existPhone = await OrderVegRegister.findOne({ where: { phone } })

        if (existPhone) {
            return res.status(400).json({
                message: "Mobile already registered!"
            })
        }

        const newUser = await OrderVegRegister.create({
            name,
            email,
            phone,
            password: hashedPass,
        })
        res.status(201).json({
            success: true,
            message: "Registration Successful",
            data: newUser
        })
    } catch (error) {
        res.status(500).json({
            message: error.errors?.[0]?.message || "Server Error",
            error: error.message
        })
    }
}


module.exports = { userReg }