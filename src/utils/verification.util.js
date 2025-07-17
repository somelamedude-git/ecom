const nodemailer = require('nodemailer');
const { asyncHandler } = require('./asyncHandler');
require('dotenv').config({path:'../.env'});
const { BaseUser } = require('../models/user.models');
const { ApiError } = require('./ApiError');

const sendEmail = async(options)=>{
    const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const mailOptions = {
    from: `${process.env.FROM_NAME}<${process.env.EMAIL_USER}>`,
    to: options.email,
    subject:options.subject,
    text:options.message,
};

await transporter.sendMail(mailOptions);
}

const verifyEmail = asyncHandler(async(req, res)=>{
    const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

    const user = await BaseUser.findOne({
        verificationToken:hashedToken,
        verificationTokenExpire:{$gt:Date.now()}
    });

    if(!user){
        throw new ApiError(400, 'Invalid or expired token');
    }

    user.isVerified=true;
    user.verificationToken=undefined;
    user.verificationTokenExpire=undefined;

    await user.save();

    res.status(200).json({
        success: true,
        message: 'Email verified successfully'
    })
})
module.exports = {
    sendEmail,
    verifyEmail
}