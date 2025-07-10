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

    let decoded
    try {
        decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
        throw ApiError(401, "Invalid or expired token")
    }

   const user =  await BaseUser.findById(decoded?._id).select("-password -refreshToken");
   if(!user) throw new ApiError(401, "Invalid access token");

   if(user.kind !== 'Admin' && user.profstatus === 'Banned')
    throw new ApiError(409, "Account is banned")

   req.user = user;
   next();

}) //to be used with each and every route except login and register

module.exports = {
    verifyJWT
} 