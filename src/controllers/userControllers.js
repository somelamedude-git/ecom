const { BaseUser, Buyer, Seller, Admin } = require('../models/user.models')
const hashPassword = require('../utils/password.util')

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

        const user = new UserKind({username, email: email.toLowerCase().trim(), password: hashedPassword, name, address, googleLogin, coverImage});
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

module.exports = {
    createUser
}