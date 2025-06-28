const { asyncHandler } = require('../utils/asyncHandler');
const { ApiError } = require('../utils/ApiError');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../.env' });
const { BaseUser } = require('../models/user.models');

const verifyJWT = asyncHandler(async(req, res, next)=>{
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if(!token){
        throw new ApiError(401, "Unauthorized Request");
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

   const user =  await BaseUser.findById(decoded?._id).select("-password -refreshToken");
   if(!user) throw new ApiError(401, "Invalid access token");

   req.user = user;
   next();

})

module.exports = {
    verifyJWT
} 