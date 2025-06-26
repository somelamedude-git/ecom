const {OAuth2Client} = require('google-auth-library');
const axios = require('axios');
const { BaseUser } = require('../models/user.models');
const { generateAccessAndRefreshTokens } = require('../utils/tokens.utils');
const asyncHandler = require('../utils/asyncHandler');


const googleLogin = asyncHandler(async (req, res) => {
    const { code } = req.query;

    const { data } = await axios.post('https://oauth2.googleapis.com/token', {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
    });

    const { access_token } = data;

    const { data: profile } = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
        headers: { Authorization: `Bearer ${access_token}` },
    });

    const user = await BaseUser.findOne({ email: profile.email });
    if (!user) {
        return res.status(404).json({ message: 'User not registered' });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    res
        .cookie('accessToken', accessToken, { httpOnly: true, secure: true })
        .cookie('refreshToken', refreshToken, { httpOnly: true, secure: true })
        .status(200)
        .json({ success: true, userId: user._id, email: user.email });
});