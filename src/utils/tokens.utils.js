const { ApiError } = require('ApiError');
const { BaseUser } = require('../models/user.models')

const generateAcessAndRefreshTokens = async(userId)=>{
    try{
        const user = await BaseUser.findById(userId);
        const accessToken = user.generateAcessToken();
        const refreshToken = user.generateRefreshAcessToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});

        return { accessToken, refreshToken };

    } catch(err){
        throw new ApiError(500, 'Something went wrong');
    }
}

module.exports = {
    generateAcessAndRefreshTokens
}