const { Seller } = require('../models/user.models');
const { ApiError } = require('../utils/ApiError');
const { asyncHandler } = require('../utils/asyncHandler');

const sellerStats = asyncHandler(async(req, res)=>{
    const user_id = req.user._id;
    const seller = await Seller.findById(user_id.toString()).populate("order_quo");
    const total_products = seller.selling_products.length;
    let pending_orders = [];
    let pending_count = 0;

    for(let order of seller.order_quo){
        if(order.status === 'pending'){
            pending_orders.push(order);
            pending_count++;
        }
    }
    res.status(200).json({
        success: true,
        totalProducts: total_products,
        pendingOrders: pending_orders
    });
});

const sellerProfile = asyncHandler(async(req, res)=>{
    const user_id = req.user._id;
    const user = await Seller.findById(user_id.toString()).select("-password")

    if(!user) throw new ApiError(404, 'User not found');
    const number_of_products = user.selling_products.length; // To be displayed in the prfile but add nav to it
    const number_of_orders = user.order_quo.length; // Same with this one

    // creat a nav for store of the user in the frontend too, not sending with this api

    res.status(200).json({
        success: true,
        user,
        number_of_products,
        number_of_orders
    });
})

module.exports = {
    sellerStats,
    sellerProfile
}