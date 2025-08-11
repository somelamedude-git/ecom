const { asyncHandler } = require('../utils/asyncHandler');
const { getUserFromToken } = require('../middlewares/auth.middleware.js');

const isLoggedIn = asyncHandler(async(req,res)=>{
    console.log('entered isLoggedIn');
    const loggedIn = !!req.user;
    const userKind = req.user.kind || null
         return res.status(200).json({
         isLoggedIn: loggedIn,
         userType: userKind
         });
})

module.exports = {
    isLoggedIn
    }
