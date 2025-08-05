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

module.exports = {
    sellerStats
}