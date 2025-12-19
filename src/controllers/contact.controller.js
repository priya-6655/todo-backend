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
        try {
            if (!process.env.BREVO_SMTP_USER || !process.env.BREVO_SMTP_PASS) {
                console.error('Brevo SMTP credentials not configured!')
            } else {
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
            }
        } catch (emailError) {
            console.error('Email error:', emailError.message)
        }

        res.status(201).json({
            success: true,
            message: emailSent ? "Message sent successfully" : "Message saved (email delivery pending)",
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