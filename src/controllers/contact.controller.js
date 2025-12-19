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

        // Send emails in background
        setImmediate(async () => {
            try {
                // Check if Brevo credentials exist
                if (!process.env.BREVO_SMTP_HOST || !process.env.BREVO_SMTP_USER || !process.env.BREVO_SMTP_PASS) {
                    console.error('Brevo SMTP credentials not configured!')
                    return
                }

                const transporter = nodemailer.createTransport({
                    host: process.env.BREVO_SMTP_HOST,
                    port: parseInt(process.env.BREVO_SMTP_PORT) || 587,
                    secure: false,
                    auth: {
                        user: process.env.BREVO_SMTP_USER,
                        pass: process.env.BREVO_SMTP_PASS
                    }
                })

                // Verify connection
                await transporter.verify()
                console.log('SMTP connection verified')

                // Mail to user
                const userMail = await transporter.sendMail({
                    from: `"Multi Web Services" <${process.env.MAIL_FROM}>`,
                    to: email,
                    subject: 'Welcome to Multi Web Services',
                    text: `Hi ${name},\n\nThanks for contacting us. Your query has been successfully sent to the admin.\n\nWith Best Regards,\nMulti Web Services`
                })
                console.log('User mail sent:', userMail.messageId)

                // Mail to admin
                const adminMail = await transporter.sendMail({
                    from: `"Contact Form" <${process.env.MAIL_FROM}>`,
                    to: process.env.ADMIN_EMAIL || process.env.MAIL_FROM,
                    replyTo: email,
                    subject: `New contact message from ${name}`,
                    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
                })
                console.log('Admin mail sent:', adminMail.messageId)

            } catch (emailError) {
                console.error('Email sending failed:', emailError.message)
                console.error('Full error:', emailError)
            }
        })

        res.status(201).json({
            success: true,
            message: "Message sent successfully",
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