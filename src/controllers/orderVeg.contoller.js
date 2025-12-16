const OrderVegRegister = require('../model/orderVegReg.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const userReg = async (req, res) => {
    try {
        const { name, email, phone, password, age, retypePass } = req.body

        if (!name || !email || !phone || !password || !age) {
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
            age
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

const usrLogin = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            res.status(400).json({
                message: "All fields are required"
            })
        }

        const existEmail = await OrderVegRegister.findOne({ where: { email } })

        if (!existEmail) {
            res.status(400).json({
                message: "Email not registered!"
            })
        }

        const validPass = await bcrypt.compare(password, existEmail.password)
        if (!validPass) {
            return res.status(400).json({ message: "Incorrect password!" })
        }

        const logStatus = await OrderVegRegister.update(
            { loginStatus: 1 },
            { where: { id: existEmail.id } }
        )

        const token = jwt.sign(
            { id: existEmail.id, email: existEmail.email },
            process.env.JWT_SECRET || 'myFirstJwtKey@123'
        )

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                user: { id: existEmail.id, email: existEmail.email, name: existEmail.name },
                token: token,
                loginStatus: 1
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });

    }
}

const vegLogout = async (req, res) => {
    try {
        console.log('Decoded user:', req.user)

        const userId = req.user.id
        console.log('User ID:', userId)

        const logStatus = await OrderVegRegister.update(
            { loginStatus: 0 },
            { where: { id: userId } }
        )

        if (logStatus) {
            return res.status(200).json({
                success: true,
                message: 'Logout successful',
                loginStatus: 0
            })
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Server error',
            error: error.message
        })
    }
}

module.exports = { userReg, usrLogin, vegLogout }