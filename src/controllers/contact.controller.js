const ContactUs = require('../model/contact.model')
const brevo = require('@getbrevo/brevo')


const defaultClient = brevo.ApiClient.instance
defaultClient.authentications['api-key'].apikey = process.env.BREVO_API_KEY


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


        const apiInst = new brevo.TransactionalEmailsApi()


        //mail to admin
        await apiInst.sendTransacEmail(
            new brevo.SendSmtpEmail({
                subject: 'New Contact Us Query',
                sender: {
                    email: process.env.MAIL_FROM,
                    name: 'todo mail'
                },
                to: [{
                    email: process.env.ADMIN_EMAIL
                }],
                replyTo: { email },
                htmlContent: `
                            <p><b>Name:</b> ${name}</p>
                            <p><b>Email:</b> ${email}</p>
                            <p><b>Message:</b> ${message}</p>
                        `
            })
        )

        //mail to user
        await apiInst.sendTransacEmail(
            new brevo.SendSmtpEmail({
                subject: 'Thanks for your query',
                sender: { email: process.env.MAIL_FROM, name: 'Todo App' },
                to: [{ email }],
                htmlContent: `
                            <p>Hi ${name},</p>
                            <p>Thanks for contacting us. We will reach you soon.</p>
                            <p>Regards,<br/>Support Team</p>
                            `
            })
        );



        return res.status(200).json({
            success: true,
            message: 'Message sent successfully',
            data: newMessage
        });

    } catch (error) {
        console.error('Contact error:', error)
        res.status(500).json({
            message: error.errors?.[0]?.message || "Server Error",
            error: error.message
        })
    }
}

module.exports = { contact }


