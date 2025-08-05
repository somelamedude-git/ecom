const { ApiError } = require('../utils/ApiError');
const { asyncHandler } = require('../utils/asyncHandler');
const { Seller } = require('../models/user.models');

const fetchSellerOrders = asyncHandler(async(req, res)=>{
    const user_id = req.user._id;
    const user = await Seller.findById(user_id.toString()).populate("order_quo");
    if(!user) throw new ApiError(404, 'User not found');

    res.status(200).json({
        success: true,
        seller_orders: user.order_quo
    })
})

module.exports = {
    fetchSellerOrders
}