const { asyncHandler } = require('../utils/asyncHandler');
const { ApiError } = require('./utils/ApiError');
const { getUserFromToken } = require('../middlewares/auth.middleware.js');

const isLoggedIn = asyncHandler(async(req,res)=>{
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    const user =await getUserFromToken(token);

    const loggedIn = !!user;

    return res.status(200).json({
        isLoggedIn: loggedIn
    });
})

module.exports = {
    isLoggedIn
    }
