const { BaseUser } = require('../models/user.models');
const { asyncHandler } = require('../utils/asyncHandler');
const { ApiError } = require('../utils/ApiError');

const fetchUserData =  asyncHandler(async(req, res)=>{
    const user_id = req.user._id;
    const user_ = await BaseUser.findById(user_id).select('-password');

    if(!user_) throw new ApiError(404, 'User not found');
    res.status(200).json({user_});
});

module.exports = {
    fetchUserData
}