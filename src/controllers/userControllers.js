const { BaseUser, Buyer, Seller, Admin } = require('../models/user.models');
const { asyncHandler } = require("../utils/asyncHandler");
const jwt = require('jsonwebtoken');
const {verifyEmail} = require('../utils/verification.util');
const axios = require('axios');
const { ApiError } = require('../utils/ApiError');
const { generateAccessAndRefreshTokens } = require('../utils/tokens.utils');
require('dotenv').config({ path: '../.env' });

const createUser = asyncHandler(async (req, res) => {

        const {kind, username, email, password, name} = req.body;

        const existingUser = await BaseUser.findOne({email: email.toLowerCase().trim()})

        if(existingUser)
            throw new ApiError(409, "You are already registered");
        
        const userKinds = {Buyer, Seller, Admin};
        const UserKind = userKinds[kind];

        if(!UserKind)
            throw new ApiError(400, "User kind not found")

        const user = new UserKind({username:username, email:email, password:password, name:name});
        await user.save();

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

         res
        .cookie('accessToken', accessToken, { httpOnly: true, secure: true })
        .cookie('refreshToken', refreshToken, { httpOnly: true, secure: true })
        .status(200)
        .json({ success: true, userId: user._id, email: user.email, message:"User created successfully" });

});

                           
const updateUser = asyncHandler(async (req, res) => {
        const { username, email, address, name, coverImage } = req.body
        let user
        if(username)
            user = await BaseUser.findOne({username})
        else if (email)
            user = await BaseUser.findOne({email})

        if(!user)
            return res.status(400).json({status: false, message: "Invalid email or password"})

        if(!address && !name && !coverImage)
            return res.status(400).json({status: false, message: "No updates provided"})

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

module.exports = {
    createUser,
    updateUser,
    deleteUser,
    verifyUser
}