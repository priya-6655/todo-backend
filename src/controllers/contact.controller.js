const ContactUs = require('../model/contact.model')
const sibApiV3Sdk = require('sib-api-v3-sdk')

//configure api
const client = sibApiV3Sdk.ApiClient.instance
const apikey = client.authentications['api-key']
apikey.apikey = process.env.BREVO_API_KEY


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


        const apiInst = new sibApiV3Sdk.TransactionalEmailsApi()


        //mail to admin
        await apiInst.sendTransacEmail({
            subject: 'New Contact Us Query',
            sender: {
                email: process.env.MAIL_FROM,
                name: 'Multi Web Services'
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

        //mail to user
        await apiInst.sendTransacEmail({
            subject: 'Thanks for your query',
            sender: { email: process.env.MAIL_FROM, name: 'Multi Web Services' },
            to: [{ email }],
            htmlContent: `
                            <p>Hi ${name},</p>
                            <p>Thanks for contacting us. We will reach you soon.</p>
                            <p>Regards,<br/>Support Team</p>
                            `
        })

        return res.status(200).json({
            success: true,
            message: 'Message sent successfully',
        });

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message })
    }
}

module.exports = { contact }


