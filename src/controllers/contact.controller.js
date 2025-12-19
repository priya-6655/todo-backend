const ContactUs = require('../model/contact.model')
const nodemailer = require('nodemailer')

// Create transporter function
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.BREVO_SMTP_HOST || 'smtp-relay.brevo.com',
        port: parseInt(process.env.BREVO_SMTP_PORT) || 587,
        secure: false,
        auth: {
            user: process.env.BREVO_SMTP_USER,
            pass: process.env.BREVO_SMTP_PASS
        },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 10000
    })
}

const contact = async (req, res) => {
    try {
        const { userId, name, email, message } = req.body

        if (!userId || !name || !email || !message) {
            return res.status(400).json({
                message: 'All fields are required!'
            })
        }

        // Save to database
        const newMessage = await ContactUs.create({
            userId,
            name,
            email,
            message
        })

        // Send emails BEFORE response (so it completes on Render)
        let emailSent = false
        let emailError = null

        // Log env vars (for debugging - remove later)
        console.log('BREVO_SMTP_HOST:', process.env.BREVO_SMTP_HOST)
        console.log('BREVO_SMTP_USER:', process.env.BREVO_SMTP_USER ? 'SET' : 'NOT SET')
        console.log('BREVO_SMTP_PASS:', process.env.BREVO_SMTP_PASS ? 'SET' : 'NOT SET')
        console.log('MAIL_FROM:', process.env.MAIL_FROM)

        if (!process.env.BREVO_SMTP_USER || !process.env.BREVO_SMTP_PASS) {
            emailError = 'Brevo SMTP credentials not configured!'
            console.error(emailError)
        } else if (!process.env.MAIL_FROM) {
            emailError = 'MAIL_FROM not configured!'
            console.error(emailError)
        } else {
            try {
                const transporter = createTransporter()

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
                    to: process.env.ADMIN_EMAIL || process.env.MAIL_FROM,
                    replyTo: email,
                    subject: `New contact message from ${name}`,
                    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
                })
                console.log('Admin mail sent')

                emailSent = true
            } catch (err) {
                emailError = err.message
                console.error('Email sending error:', err.message)
            }
        }

        res.status(201).json({
            success: true,
            message: emailSent ? "Message sent successfully" : "Message saved",
            emailStatus: emailSent ? "sent" : "failed",
            emailError: emailError,
            data: newMessage
        })
    } catch (error) {
        console.error('Contact error:', error)
        res.status(500).json({
            message: error.errors?.[0]?.message || "Server Error",
            error: error.message
        })
    }
}

module.exports = { contact }