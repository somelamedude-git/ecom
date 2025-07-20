const { asyncHandler } = require('../utils/asyncHandler');
const { ApiError } = require('../utils/ApiError');
const { Buyer } = require('../models/user.models');

const fetchCart = asyncHandler(async(req, res)=>{
    const user_id = req.user._id;
    const user = await Buyer.findById(user_id).populate("cart.product");

    if(!user){
        throw new ApiError(404, 'You are not logged in');
    }

    const cart_items = user.cart;

    return res.status(200).json({
        success: true,
        cart: cart_items
    })
})

module.exports = {
    fetchCart
}