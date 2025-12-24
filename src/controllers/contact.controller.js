const ContactUs = require('../model/contact.model')
const sibApiV3Sdk = require('sib-api-v3-sdk')

const contact = async (req, res) => {
    try {
        const { userId, name, email, message } = req.body

        if (!userId || !name || !email || !message) {
            return res.status(400).json({
                message: 'All fields are required!'
            })
        }

        // Check if Brevo credentials are configured
        if (!process.env.BREVO_API_KEY) {
            console.error('BREVO_API_KEY not configured!')
            return res.status(500).json({ message: 'Email service not configured' })
        }

        if (!process.env.MAIL_FROM || !process.env.ADMIN_EMAIL) {
            console.error('MAIL_FROM or ADMIN_EMAIL not configured!')
            return res.status(500).json({ message: 'Email settings not configured' })
        }

        // Save to database
        const newMessage = await ContactUs.create({
            userId,
            name,
            email,
            message
        })

        // Configure Brevo API
        const client = sibApiV3Sdk.ApiClient.instance
        const apiKey = client.authentications['api-key']
        apiKey.apiKey = process.env.BREVO_API_KEY

        const apiInstance = new sibApiV3Sdk.TransactionalEmailsApi()

        // Mail to admin
        await apiInstance.sendTransacEmail({
            subject: 'New Contact Us Query',
            sender: {
                email: process.env.MAIL_FROM,
                name: 'Multi Web Services'
            },
            to: [{ email: process.env.ADMIN_EMAIL }],
            replyTo: { email: email },
            htmlContent: `
                <p><b>Name:</b> ${name}</p>
                <p><b>Email:</b> ${email}</p>
                <p><b>Message:</b> ${message}</p>
            `
        })
        console.log('Admin mail sent')

        // Mail to user
        await apiInstance.sendTransacEmail({
            subject: 'Thanks for your query',
            sender: { email: process.env.MAIL_FROM, name: 'Multi Web Services' },
            to: [{ email: email }],
            htmlContent: `
                <p>Hi ${name},</p>
                <p>Thanks for contacting us. We will reach you soon.</p>
                <p>Regards,<br/>Support Team</p>
            `
        })
        console.log('User mail sent to:', email)

        return res.status(200).json({
            success: true,
            message: 'Message sent successfully',
            data: newMessage
        })

    } catch (error) {
        console.error('Contact error:', error.message)
        res.status(500).json({ message: 'Server Error', error: error.message })
    }
}

module.exports = { contact }


