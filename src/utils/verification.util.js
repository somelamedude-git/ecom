const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

const verifyEmail = async (user) => {
    const verificationToken = jwt.sign(
        {email: user.email},
        process.env.EMAIL_VERIFY_SECRET,
        {expiresIn: '1h'}
    )

    const verificationLink = `http://localhost:${process.env.PORT}/verify-email?verificationToken=${verificationToken}`

    await transporter.sendMail({
        from: `ECOM ${process.env.EMAIL_USER}`,
        to: user.email,
        subject: `Verify Email`,
        html: `<p>Click the link below to verify your email:</p>
         <a href="${verificationLink}">${verificationLink}</a>`
    })
}

module.exports = {
    verifyEmail
}