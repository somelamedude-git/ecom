const { asyncHandler } = require('../utils/asyncHandler');
const { ApiError } = require('../utils/ApiError');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../.env' });
const { BaseUser, Admin } = require('../models/user.models');


const getUserFromToken = asyncHandler(async(token)=>{
    if(!token) return null;

    let decoded;

    try{
        
       decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

       }catch(error){
           return null;
          }

     const user = await BaseUser.findById(decoded?._id).select("-password -refreshToken");
     if(!user) return null;

     if(!user.kind !== 'Admin' || user.isBan){
         return null;}

      return user;}
       )

const verifyJWT = asyncHandler(async(req, res)=>{
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    const user = await getUserFromToken(token);

    if(!user){
        throw new ApiError(401, "Unauthorized accedd");
    }
    req.user = user;
    next();
})

const looseVerification = asyncHandler(async(req, res, next)=>{
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    const user = await getUserFromToken(token);
    req.user = user;
    next();
});

const adminCheck = asyncHandler(async (req, res, next) => {
    const id = req.user._id
    const admin = await Admin.findById(id)

    if(admin)
        next()

    throw new ApiError(404, "Admin not found")
})

module.exports = {
    verifyJWT,
    looseVerification,
    getUserFromToken,
    adminCheck
} 
