const { asyncHandler } = require('../utils/asyncHandler');
const { ApiError } = require('../utils/ApiError');
const { Buyer } = require('../models/user.models');

const fetchCart = asyncHandler(async(req, res)=>{
    const user_id = req.user._id;
    const user = await Buyer.findById(user_id).populate("cart.product", "");

    if(!user){
        throw new ApiError(404, 'You are not logged in');
    }

    const cart_items = user.cart || []; // Fallback cuz why not
    const cart_length = cart_items.length;

    return res.status(200).json({
        success: true,
        cart: cart_items, // we export cart, we map it, ultimately items ke hum properties chori kr lenge frontend mein
        cart_length: cart_length
    })
})

module.exports = {
    fetchCart
}