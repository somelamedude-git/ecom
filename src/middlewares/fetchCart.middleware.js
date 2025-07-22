const { asyncHandler } = require('../utils/asyncHandler');
const { ApiError } = require('../utils/ApiError');
const { Buyer } = require('../models/user.models');

const filterOutItems = asyncHandler(async (req, res, next) => {
    const user_id = req.user._id;
    const user = await Buyer.findById(user_id);

    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    user.cart = (user.cart || []).filter(item => item.quantity > 0);
    await user.save();

    req.cart = user.cart;

    next(); 
});

module.exports = {
    filterOutItems
};
