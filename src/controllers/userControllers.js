const { BaseUser, Buyer, Seller, Admin } = require('../models/user.models')
const {hashPasswords, comaprePassword} = require('../utils/password.util')
const {OAuth2Client} = require('google-auth-library')
require('dotenv').config()

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const createUser = async (req, res) => {
    try{

        const {kind, username, email, password, name, address, googleLogin, coverImage} = req.body;

        const existingUser = await BaseUser.findOne({email: email.toLowerCase().trim()})

        if(existingUser)
            return res.status(409).json({status: false, message: "Email already exists"})
        
        const userKinds = {Buyer, Seller, Admin};
        const UserKind = userKinds[kind];

        if(!UserKind)
            return res.status(400).json({status: false, message: "User kind not found"})

        const hashedPassword = hashPassword(password)

        const user = new UserKind({username, email, password: hashedPassword, name, address, googleLogin, coverImage});
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
    } catch (err) {
        console.log(err)
        return res.status(500).json({status: false, message: "Internal server error"})
    }
}

const getUser = async(req, res) => {
    try{
        const {googleLogin, token, email, password} = req.body;

        if(googleLogin){
            try{
                const ticket = await client.verifyIdToken({
                    idToken: token,
                    audience: process.env.GOOGLE_CLIENT_ID
                })

                const payload = ticket.getPayload()
                const {email} = payload

                const user = await User.findOne({email})
                if(user)
                    return res.status(200).json({status: true, message: "User found"})
                return res.status(401).json({status: false, message: "User credentials incorrect"})
            } catch (err) {
                console.error("Google login error:", error);
                return res.status(401).json({ message: "Invalid Google token" });
            }
        }

        if(comaprePassword(password,email))
            return res.status(200).json({status: true, message: "User found successfully"});
        return res.status(401).json({status: false, message: "Invalid credentials"});
    } catch (err) {
        console.log(err)
        return res.status(500).json({status: false, message: "Internal server error"})
    }
}

module.exports = {
    createUser,
}