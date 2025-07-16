const { BaseUser, Buyer, Seller, Admin } = require('../models/user.models');
const { asyncHandler } = require("../utils/asyncHandler");
const jwt = require('jsonwebtoken');
const {verifyEmail} = require('../utils/verification.util');
const { ApiError } = require('../utils/ApiError');
const { generateAccessAndRefreshTokens } = require('../utils/tokens.utils');
const axios = require('axios');
require('dotenv').config({ path: '../.env' });

const createUser = asyncHandler(async (req, res) => {

        const {kind, username, email, password, name, age} = req.body;
        if(!kind || !username || !email || !password || !name || !age){
            throw new ApiError(500, 'Bad request');
        }

        const existingUser = await BaseUser.findOne({email: email.toLowerCase().trim()})

        if(existingUser)
            throw new ApiError(409, "You are already registered");
        
        const userKinds = {Buyer, Seller, Admin};
        const UserKind = userKinds[kind];

        if(!UserKind)
            throw new ApiError(400, "User kind not found")

        const user = new UserKind({username:username, email:email, password:password, name:name, age:age});
        await user.save();

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

         res
        .cookie('accessToken', accessToken, { httpOnly: true, secure: true })
        .cookie('refreshToken', refreshToken, { httpOnly: true, secure: true })
        .status(200)
        .json({ success: true, userId: user._id, email: user.email, message:"User created successfully" });

});

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

const manualLogin = asyncHandler(async (req, res)=>{
    const { email, password } = req.body;
    
    if(!email) throw new ApiError(400, "Email is required to log in");

    const user = await BaseUser.findOne({email: email});
    if(!user){
        throw new ApiError(404, "User not found");
    }

    const isPasswordVerified = await user.isPasswordCorrect(password);
    if(!isPasswordVerified) throw new ApiError(401, "Invalid user credentials");

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
    res
        .cookie('accessToken', accessToken, { httpOnly: true, secure: true })
        .cookie('refreshToken', refreshToken, { httpOnly: true, secure: true })
        .status(200)
        .json({ success: true, userId: user._id, email: user.email });

});

                           
const updateUser = asyncHandler(async (req, res) => {
    const user_id = req.user._id;
        const { address, name, coverImage } = req.body
        let user = await BaseUser.findById(user_id);
    
        if(!user)
            throw new ApiError(404, "User not found");

        if(!address && !name && !coverImage)
            return res.status(400).json({status: false, message: "No updates provided"});

        if(address)
            user.address = address
        if(name)
            user.name = name
        if(coverImage)
            user.coverImage = coverImage

        await user.save()

        return res.status(200).json({status: true, message: "Changes made successfully"});
});

const deleteUser = asyncHandler(async(req, res) => {
        const user_id = req.user._id;
        const admin =await  Admin.findById(user_id);

        if(!admin){
            throw new ApiError(500, 'You are not authorized to perform this action');
           }

        const {email, token} = req.body;

        const user = await BaseUser.findOne({email})

        if(!user)
            return res.status(404).json({status: false, message: "User not found"})

        if(user.googleLogin){
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID
            })

            const payload = ticket.getPayload()
            const {email: tokenEmail} = payload

            if(tokenEmail === user.email){
                await BaseUser.deleteOne({email})
                return res.status(200).json({status: true, message: "User deleted successfully"})
            }
            return res.status(401).json({status: false, message: "Invalid Token"})
        }

        if(user.isVerified){
            await BaseUser.deleteOne({email})
            return res.status(200).json({status: true, message: "User deleted successfully"})
        }

        await verifyEmail(user)
});

const verifyUser = asyncHandler(async (req, res) => {
        const {token} = req.query
        const decoded = jwt.verify(token, process.env.EMAIL_VERIFY_SECRET)
        const user = await BaseUser.findOne({email: decoded.email})

        if(!user)
            return res.status(400).json({status: false, message: "Invalid link"})

        user.isVerified = true;
        await user.save()
        return res.status(200).json({status: true, message: "Email verified successfully"})
})

const banUser = asyncHandler(async(req, res) => {
    const user_id = req.user._id;
    const admin = await Admin.findById(user_id);

    if(!admin){
        throw new ApiError(500, 'You are not authorized to perform this action');
       }
    const {id} = req.query;
    const user = await  BaseUser.findOne({_id: id})
    if(user && user.kind !== 'Admin'){
        user.isBan = true;
        await user.save()
        return res.status(200).json({status: true, message: "User banned"})
    }
    return res.status(400).json({status: false, message: "User not found"})
})

const unbanUser = asyncHandler(async(req, res) => {
    const {id} = req.query;
    const user = BaseUser.findOne({_id: id})
    if(user && user.kind !== 'Admin'){
        user.isBan  = false
        await user.save()
        return res.status(200).json({status: true, message: "User unbanned"})
    }
    return res.status(400).json({status: false, message: "User not found"})
})

module.exports = {
    createUser,
    googleLogin,
    manualLogin,
    updateUser,
    deleteUser,
    verifyUser,
    banUser,
    unbanUser
}
