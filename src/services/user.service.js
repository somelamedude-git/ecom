const axios = require('axios');
require('dotenv').config({ path: '../.env' });
const { asyncHandler } = require('../utils/asyncHandler');
const { BaseUser } = require('../models/user.models');
const { generateAccessAndRefreshTokens } = require('../utils/tokens.utils');

const googleLogin = asyncHandler(async(req, res)=>{
    const { code } = req.query;
   const { data } = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      code,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code',
    });

    const { access_token, id_token } = data;

    const { data: profile } = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const user_email = profile.email;
    
    let user = await BaseUser.findOne({email: user_email});

    if(user){
        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
        const loggedInUser = await BaseUser.findById(user._id).select("-password -refreshToken");

        const options = {
            httpOnly: true,
            secure: true
        }
        
        return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            {
                success:true,
                id: loggedInUser._id,
                email: loggedInUser.email
            }
        )
    }
})

module.exports = {
    googleLogin
}
