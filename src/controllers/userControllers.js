const { BaseUser, Buyer, Seller, Admin } = require('../models/user.models');
const {OAuth2Client} = require('google-auth-library');
const { asyncHandler } = require("../utils/asyncHandler");
const jwt = require('jsonwebtoken');
const {verifyEmail} = require('../utils/verification.util');
const { Response, Request, CookieOptions } = require('express');
const { generateAccessAndRefreshTokens, generateAcessAndRefreshTokens } = require('../utils/tokens.utils');
const axios = require('axios');
require('dotenv').config({ path: '../.env' });

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const createUser = asyncHandler(async (req, res) => {

        const {kind, username, email, password, name, googleLogin, coverImage} = req.body;

        const existingUser = await BaseUser.findOne({email: email.toLowerCase().trim()})

        if(existingUser)
            return res.status(409).json({status: false, message: "Email already exists"})
        
        const userKinds = {Buyer, Seller, Admin};
        const UserKind = userKinds[kind];

        if(!UserKind)
            return res.status(400).json({status: false, message: "User kind not found"})


        const user = new UserKind({username, email, password, name, address, googleLogin, coverImage});
        const refreshToken = user.generateRefreshAccessToken();
        user.refreshToken = refreshToken;

        await user.save()

        return res.status(201).json({status: true, 
                                    message: "User created successfully",
                                    User: {
                                        id: user._id,
                                        username: user.username,
                                        email: user.email,
                                        name: user.name,
                                        kind: user.kind
                                 }})
});

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
});

const getUser = asyncHandler(async(req, res) => {
        const {googleLogin, token, email, password} = req.body;

        if(googleLogin){
            try{
                const ticket = await client.verifyIdToken({
                    idToken: token,
                    audience: process.env.GOOGLE_CLIENT_ID
                })

                const payload = ticket.getPayload();
                const {email} = payload;

                let google_user = await BaseUser.findOne({email});

                if(google_user){
                    ;
                }
                else return res.status(401).json({status: false, message: "User credentials incorrect"});
            } catch (err) {
                console.error("Google login error:", err);
                return res.status(401).json({ message: "Invalid Google token" });
            }
        }
        if(!user){
            return res.status(401).json({
                status: false,
                message: "Invalid email or password"
            });
        }

        const isValid = await user.isPasswordCorrect(password);

        if(isValid){
            const { accessToken, refreshToken } = await generateAcessAndRefreshTokens(user._id);
        }
        return res.status(401).json({status: false, message: "Invalid credentials"});
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
    googleLogin,
    getUser,
    updateUser,
    deleteUser,
    verifyUser
}