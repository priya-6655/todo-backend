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

        // Send emails using Gmail
        let emailSent = false
        let emailError = null

        if (
            !process.env.BREVO_SMTP_HOST ||
            !process.env.BREVO_SMTP_PORT ||
            !process.env.BREVO_SMTP_USER ||
            !process.env.BREVO_SMTP_PASS ||
            !process.env.MAIL_FROM
        ) {
            emailError = 'Mail credentials not configured!';
        } else {
            try {
                const transporter = nodemailer.createTransport({
                    host: process.env.BREVO_SMTP_HOST,
                    port: process.env.BREVO_SMTP_PORT,
                    secure: false,
                    auth: {
                        user: process.env.BREVO_SMTP_USER,
                        pass: process.env.BREVO_SMTP_PASS
                    }
                })

                // Mail to user
                await transporter.sendMail({
                    from: `"Multi Web Services" <${process.env.MAIL_FROM}>`,
                    to: email,
                    subject: 'Welcome to Multi Web Services',
                    text: `Hi ${name},\n\nThanks for contacting us. Your query has been successfully sent to the admin.\n\nWith Best Regards,\nMulti Web Services`
                })
                console.log('User mail sent to:', email)

                // Mail to admin
                await transporter.sendMail({
                    from: `"Contact Form" <${process.env.MAIL_FROM}>`,
                    to: process.env.MAIL_FROM,
                    replyTo: email,
                    subject: `New contact message from ${name}`,
                    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
                })
                console.log('Admin mail sent')

                emailSent = true;

                res.status(201).json({
                    success: true,
                    message: emailSent ? "Message sent successfully" : "Message saved",
                    emailStatus: emailSent ? "sent" : "failed",
                    emailError: emailError,
                    data: newMessage
                })
            } catch (err) {
                emailError = err.message
                console.error('Email error:', err.message)
                res.status(500).json({
                    message: err.errors?.[0]?.message || "Server Error",
                    error: err.message
                })
            }
        }
    } catch (error) {
        console.error('Contact error:', error)
        res.status(500).json({
            message: error.errors?.[0]?.message || "Server Error",
            error: error.message
        })
    }
}

module.exports = { contact }


