const nodemailer = require('nodemailer');
require('dotenv').config({path:'../.env'});


    // const verificationToken = jwt.sign(
    //     {email: user.email},
    //     process.env.EMAIL_VERIFY_SECRET,
    //     {expiresIn: '1h'}
    // )

const sendEmail = async(options)=>{
    const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const mailOptions = {
    from: `${process.env.FROM_NAME}<${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject:options.subject,
    text:options.message,
};

await transporter.sendMail(mailOptions);
}
module.exports = {
    sendEmail
}