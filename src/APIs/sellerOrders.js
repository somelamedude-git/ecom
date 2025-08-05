const { ApiError } = require('../utils/ApiError');
const { asyncHandler } = require('../utils/asyncHandler');
const { Seller } = require('../models/user.models');

const fetchSellerOrders = asyncHandler(async (req, res) => {
    const user_id = req.user._id;
    
    const user = await Seller.findById(user_id.toString()).select("order_quo").populate("order_quo").lean();
    if (!user) throw new ApiError(404, 'User not found');

    let { page = 1, limit = 10, filter = "" } = req.query;
    page = Number(page);
    limit = Number(limit);
    filter = filter.toLowerCase();

    let orders = user.order_quo;
    if (filter !== "") {
        orders = orders.filter(order => order.status.toLowerCase() === filter);
    }

    const start = (page - 1) * limit;
    const end = start + limit;

    const orders_send = orders.slice(start, end);

    res.status(200).json({
        success: true,
        seller_orders: orders_send
    });
});

const updateStatus = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const user_id = req.user._id;
    const { status } = req.body;

    const user = await Seller.findById(user_id).select("order_quo").populate("order_quo");
    if (!user) throw new ApiError(404, 'User not found');

    const order = user.order_quo.find(order => order._id.toString().equals(orderId.toString()));
    if (!order) throw new ApiError(400, 'You are not authorized to change this order');

    order.status = status;
    await order.save();

    res.status(200).json({
        success: true,
        message: "Status updated"
    });
});


module.exports = {
    fetchSellerOrders,
    updateStatus
}
