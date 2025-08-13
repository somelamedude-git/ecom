const { asyncHandler } = require('../utils/asyncHandler');
const { ApiError } = require('../utils/ApiError');
const { verifyPassword, sendEmail } = require('../utils/verification.util');
const { BaseUser } = require('../models/user.models');

const sendForgotMail = asyncHandler(async(req, res)=>{
    const { email } = req.body;
    const user = await BaseUser.findOne({email:email});

    if(!user){
        throw new ApiError(404, 'Seems like you are not registered with this email');
    }
    
});

module.exports = {
    sendForgotMail
}