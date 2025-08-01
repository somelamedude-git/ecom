const { asyncHandler } = require('../utils/asyncHandler');
const { ApiError } = require('../utils/ApiError');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../.env' });
const { BaseUser, Admin } = require('../models/user.models');
const mongoose = require('mongoose');


const getUserFromToken = async(token)=>{
    console.log('getUserFromToken');
    if(!token) {console.log('token not found'); return null;}

    let decoded;

    try{
        
       decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
       console.log(decoded);

       }catch(error){
        console.log('inside error');
           return null;
          }

    const user = await BaseUser.findById(decoded._id.toString()).select('-password -refreshToken');

     if(!user) {console.log('in guft, user not found'); return null;}

     if(user.isBan){
        console.log('guft, user kind not found'); return null;}

      return user;}
       

const verifyJWT = asyncHandler(async(req, res)=>{
    console.log('verifyJWT');
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    const user = await getUserFromToken(token);

    if(!user){
        throw new ApiError(401, "Unauthorized accedd");
    }
    req.user = user;
    next();
})

const looseVerification = asyncHandler(async(req, res, next)=>{
    console.log('looseVerification');
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    const user = await getUserFromToken(token);
    if(!user) console.log('in looseVerif, user not found here as well');
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
