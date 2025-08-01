const { asyncHandler } = require('../utils/asyncHandler');
const { ApiError } = require('../utils/ApiError');
const { getUserFromToken } = require('../middlewares/auth.middleware.js');

const isLoggedIn = asyncHandler(async(req,res)=>{
    console.log('entered isLoggedIn');
    const loggedIn = !!req.user;
         return res.status(200).json({
         isLoggedIn: loggedIn
         });
})

module.exports = {
    isLoggedIn
    }
