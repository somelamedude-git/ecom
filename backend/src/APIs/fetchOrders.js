const { Order } = require("../models/order.models");
const { BaseUser } = require("../models/user.models");
const { ApiError } = require("../utils/ApiError");
const { asyncHandler } = require("../utils/asyncHandler");

const getOrders = asyncHandler(async (req, res) => {
    const user_id = req.user._id;
    const { status } = req.query;

    const allowedStatus = [
        'confirmed',
        'delivered',
        'cancelled',
        'schedule_return',
        'returned',
        'approve_return',
        'shipped'
    ];

    if (status && !allowedStatus.includes(status)) {
        throw new ApiError(400, "Status not allowed");
    }

    const user = await Buyer.findById(user_id).populate({
        path: 'orderHistory',
        populate: {
            path: '$',
            model: 'Order'
        }
    }).select('orderHistory');

    let orders = user.orderHistory;

    if (status) {
        orders = orders.map(batch => batch.filter(order => order.status === status))
                       .filter(batch => batch.length > 0);
    }

    res.status(200).json({ status: true, orders });
});


module.exports= {
    getOrders
}