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

        setImmediate(async () => {
            const transporter = nodemailer.createTransport({
                host: process.env.BREVO_SMTP_HOST,
                port: process.env.BREVO_SMTP_PORT,
                secure: false,
                auth: {
                    user: process.env.BREVO_SMTP_USER,
                    pass: process.env.BREVO_SMTP_PASS
                }
            })

            // mail to user
            await transporter.sendMail({
                from: `"Multi Web Services" <${process.env.MAIL_FROM}>`,
                to: email,
                subject: 'Welcome to Multi web services',
                text: `Hi ${name},\n\n Thanks for contacting us. your query has been successfully sent to the admin\n\nBest Regards\nMulti web services`
            })

            // mail to admin
            await transporter.sendMail({
                from: `"Contact Form" <${process.env.MAIL_FROM}>`,
                to: process.env.MAIL_FROM,
                replyTo: email,
                subject: `New contact message from ${name}`,
                text: `Name:${name}\nEmail:${email}\n\nMessage:\n${message}`
            })
        })
        res.status(201).json({
            success: true,
            message: "Message sent successfully",
            data: newMessage
        })
    } catch (error) {
        res.status(500).json({
            message: error.errors?.[0]?.message || "Server Error",
            error: error.message
        })
    }
}

module.exports = { contact }