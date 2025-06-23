const { BaseUser, Buyer, Seller, Admin } = require('../models/user.models');
const {OAuth2Client} = require('google-auth-library');
const { asyncHandler } = require("../utils/asyncHandler");
require('dotenv').config()

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const createUser = asyncHandler(async (req, res) => {

        const {kind, username, email, password, name, address, googleLogin, coverImage} = req.body;

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

const getUser = asyncHandler(async(req, res) => {
        const {googleLogin, token, email, password} = req.body;
        let user = await BaseUser.findOne({email});

        if(googleLogin){
            try{
                const ticket = await client.verifyIdToken({
                    idToken: token,
                    audience: process.env.GOOGLE_CLIENT_ID
                })

                const payload = ticket.getPayload()
                const {email} = payload

                user = await BaseUser.findOne({email})
                if(user)
                    return res.status(200).json({status: true, message: "User found"})
                return res.status(401).json({status: false, message: "User credentials incorrect"})
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

        if(isValid)
            return res.status(200).json({status: true, message: "User found successfully"});
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

module.exports = {
    createUser,
    getUser,
    updateUser
}