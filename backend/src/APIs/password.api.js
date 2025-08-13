const { asyncHandler } = require('../utils/asyncHandler');
const { ApiError } = require('../utils/ApiError');
const { sendEmail } = require('../utils/verification.util');
const { BaseUser } = require('../models/user.models');

const sendForgotMail = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await BaseUser.findOne({ email: email });
    if (!user) {
        return res.status(200).json({
            success: true,
            message: 'If an account with that email exists, a verification link has been sent.'
        });
    }
    const passwordToken = user.getPasswordToken();
    await user.save({ validateBeforeSave: false });

    const verification_url = `${req.protocol}://${req.get('host')}/api/forgot-password/${passwordToken}`;

    const message = `Click this link to verify you own this account: ${verification_url}`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password Reset Verification',
            message
        });
        res.cookie("email", email,{
            httpOnly: true,
            secure:false,
            sameSite: 'lax'
        });

        res.status(200).json({
            success: true,
            message: 'If an account with that email exists, a verification link has been sent.'
        });
    } catch (err) {
        user.passwordToken = undefined;
        user.passwordExpire = undefined;
        await user.save({ validateBeforeSave: false });

        throw new ApiError(500, 'Error sending email. Please try again later.');
    }
});

const updatePassword = asyncHandler(async(req, res)=>{
    const email = req.cookies?.email;
    const user = await BaseUser.findOne({email:email});
    if(!user) throw new ApiError(404, 'User not found');

    const { new_password } = req.body;
    user.password = new_password;
    user.passwordToken = undefined;
    user.passwordTokenExpire = undefined;
    user.passwordLinkClicked = false;

    res.cookie("passwordLinkClicked", user.passwordLinkClicked, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax'
    })

    await user.save();
    
    res.status(200).json({
        success: true,
        message: 'Password updated successfully'
    })
});

const returnPasswordLinkClickedStat = asyncHandler(async(req, res)=>{ 
    const passwordLinkClicked = req.cookies?.passwordLinkClicked;
    console.log(passwordLinkClicked);

    res.status(200).json({
        success: true,
        clickStatus: Boolean(passwordLinkClicked)
    })
})
module.exports = {
    sendForgotMail,
    updatePassword,
    returnPasswordLinkClickedStat
};
