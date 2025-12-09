const Registration = require('../model/register.model')


const userReg = async (req, res) => {
    try {
        const { fname, lname, gender, phone, regUsername, regEmail, regPass } = req.body

        if (!fname || !lname || !gender || !phone || !regUsername || !regEmail || !regPass) {
            return res.status(400).json({
                message: 'All fields are required'
            })
        }

        const existEmail = await Registration.findOne({ where: { regEmail } })

        if (existEmail) {
            return res.status(400).json({
                message: "Email already registered"
            })
        }

        const existPhone = await Registration.findOne({ where: { phone } })

        if (existPhone) {
            return res.status(400).json({
                message: "Mobile already registered"
            })
        }

        const newUser = await Registration.create({
            fname,
            lname,
            gender,
            phone,
            regUsername,
            regEmail,
            regPass
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
        const { email, pass } = req.body

        if (!email || !pass) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const user = await Registration.findOne({ where: { regEmail: email } })

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.regPass !== pass) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: { id: user.id, username: user.regUsername }
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

        const updated = await Registration.update(req.body, { where: { id } });

        if (updated[0] === 0) {
            return res.status(404).json({ message: "User not found or no changes made" });
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully"
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}


module.exports = { userReg, userLogin, getUser, editProfile }