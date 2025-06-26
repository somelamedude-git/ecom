const { ApiError } = require('./ApiError');
const { BaseUser } = require('../models/user.models')

const generateAccessAndRefreshTokens = async(userId)=>{
    try{
        const user = await BaseUser.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshAccessToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});

        return { accessToken, refreshToken };

    } catch(err){
        throw new ApiError(500, 'Something went wrong');
    }
}

module.exports = {
    generateAccessAndRefreshTokens
}