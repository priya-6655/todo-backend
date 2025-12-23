const ContactUs = require('../model/contact.model')
const nodemailer = require('nodemailer')


const contact = async (req, res) => {
    try {
        const { userId, name, email, message } = req.body

        if (!userId || !name || !email || !message) {
            return res.status(400).json({
                message: 'All fields are required!'
            })
        }

        const newMessage = await ContactUs.create({
            userId,
            name,
            email,
            message
        })



        const transporter = nodemailer.createTransport({
            host: process.env.BREVO_SMTP_HOST,
            port: process.env.BREVO_SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.BREVO_SMTP_USER,
                pass: process.env.BREVO_SMTP_PASS
            }
        })


        //Mail to ADMIN
        await transporter.sendMail({
            from: process.env.MAIL_FROM,
            to: process.env.ADMIN_EMAIL,
            subject: 'New Contact Us Query',
            html: `
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong> ${message}</p>
            `
        })

        // Mail to USER
        await transporter.sendMail({
            from: process.env.MAIL_FROM,
            to: email,
            subject: 'Thanks for your query',
            html: `
                <p>Hi ${name},</p>
                <p>Thanks for contacting us. We will reach you soon.</p>
                <p>Regards,<br/>Support Team</p>
            `
        })

        res.status(200).json({
            success: true,
            message: 'Message sent successfully',
            data: newMessage
        })
        console.log('Admin mail sent')

    } catch (error) {
        console.error('Contact error:', error)
        res.status(500).json({
            message: error.errors?.[0]?.message || "Server Error",
            error: error.message
        })
    }
}

module.exports = { contact }


