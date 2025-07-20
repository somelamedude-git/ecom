const { asyncHandler } = require('../utils/asyncHandler');
const { ApiError } = require('../utils/ApiError');
const { Buyer } = require('../models/user.models.js');

const fetchLength = asyncHandler(async(req, res)=>{
    if(!req.user){
       return  res.status(200).json({
            wish_length:0,
            cart_length:0,
            orderHistory_length: 0
        });
    }

    const user_id = req.user._id;
    const user = await Buyer.findById(user_id).select("wishlist orderHistory cart");

    if(!user) throw new ApiError(404, "User not found");
    const cart_length = user.cart.length;
    const orderHistory_length = user.orderHistory.length;
    const wishlist_length = user.wishlist.length;

    return res.status(200).json({
        wish_length: wishlist_length,
        cart_length: cart_length,
        orderHistory_length: orderHistory_length
    });
    
    })
