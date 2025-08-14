const { asyncHandler } = require('../utils/asyncHandler')
const {nodemailer} = require('nodemailer')

const mail = asyncHandler(async (req, res) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })

    const {firstName, lastName, email, message} = req.body

    const mailOptions = {
        from: email,
        to: process.env.EMAIL_USER,
        subject: 'Message from the Clique User',
        html: `<h1>${firstName} ${lastName}</h1>
        <h2>${message}</h2>`
    }

    const info = await transporter.sendMail(mailOptions)
    console.log(info.response)
})

module.exports = {
    sendMail
}