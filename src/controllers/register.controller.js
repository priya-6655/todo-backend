const Registration = require('../model/register.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const userReg = async (req, res) => {
    try {
        const { fname, lname, gender, phone, regUsername, regEmail, regPass } = req.body

        if (!fname || !lname || !gender || !phone || !regUsername || !regEmail || !regPass) {
            return res.status(400).json({
                message: 'All fields are required!'
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPass = await bcrypt.hash(regPass, salt)

        const existEmail = await Registration.findOne({ where: { regEmail } })

        if (existEmail) {
            return res.status(400).json({
                message: "Email already registered!"
            })
        }

        const existPhone = await Registration.findOne({ where: { phone } })

        if (existPhone) {
            return res.status(400).json({
                message: "Mobile already registered!"
            })
        }

        const newUser = await Registration.create({
            fname,
            lname,
            gender,
            phone,
            regUsername,
            regEmail,
            regPass: hashedPass
        })
        res.status(201).json({
            success: true,
            message: "Registration Successful",
            data: newUser
        })
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message
        })
    }
}

const userLogin = async (req, res) => {
    try {
        const { userName, pass } = req.body

        if (!userName || !pass) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const user = await Registration.findOne({ where: { regUsername: userName } })

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(pass, user.regPass)

        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect password" })
        }

        const token = jwt.sign(
            { id: user.id, username: user.regUsername },
            process.env.JWT_SECRET || 'myFirstJwtKey@123',
            { expiresIn: '1h' }
        )

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                user: { id: user.id, username: user.regUsername },
                token: token
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

const getUser = async (req, res) => {
    try {
        const { id } = req.params
        const userProfile = await Registration.findByPk(id)

        if (!userProfile) {
            return res.status(404).json({ message: "User not found" })
        }

        res.status(200).json({
            success: true,
            data: userProfile
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

const editProfile = async (req, res) => {
    try {
        const { id } = req.params

        const user = await Registration.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        let imageurl = user.image
        if (req.file) {
            imageurl = req.file.path
            console.log('Image uploaded to Cloudinary:', imageurl)
        }

        const updatedUserData = {
            fname: req.body.fname || user.fname,
            lname: req.body.lname || user.lname,
            gender: req.body.gender || user.gender,
            phone: req.body.phone || user.phone,
            regUsername: req.body.regUsername || user.regUsername,
            regEmail: req.body.regEmail || user.regEmail,
            image: imageurl
        }

        await user.update(updatedUserData)

        const updatedUser = await Registration.findByPk(id)

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: updatedUser
        });

    } catch (error) {
        console.error('Edit profile error:', error)
        res.status(500).json({ message: "Server error", error: error.message });
    }
}


module.exports = { userReg, userLogin, getUser, editProfile }