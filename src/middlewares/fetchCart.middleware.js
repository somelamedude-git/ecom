const { asyncHandler } = require('../utils/asyncHandler');
const { ApiError } = require('../utils/ApiError');
const { Buyer } = require('../models/user.models');

const filterOutItems = asyncHandler(async (req, res, next) => {
    console.log('Entered the middleware of filtering items out')
    const user_id = req.user._id;
    const user = await Buyer.findById(user_id.toString()).populate("cart.product");

    if (!user) {
        console.log('In cart middleware, user not found');
        throw new ApiError(404, 'User not found');
    }

    console.log('User found, I am in cart middleware');
    user.cart = (user.cart || []).filter(item => item.product && item.quantity > 0);
    await user.save();

    req.cart = user.cart; // full data jayega ismein 
    next(); 
});

module.exports = {
    filterOutItems
};
