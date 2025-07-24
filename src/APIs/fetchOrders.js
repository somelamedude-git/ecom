const { Order } = require("../models/order.models");
const { BaseUser } = require("../models/user.models");
const { ApiError } = require("../utils/ApiError");
const { asyncHandler } = require("../utils/asyncHandler");

const getOrders = asyncHandler(async (req, res) => {
    const user = req.user._id
    const {status} = req.query

    const customer = await BaseUser.findById(user)

    if(!customer)
        throw new ApiError(404, "User not found")

    let query = {
        customer: customer._id
    }

    const allowedStatus = [
        'pending',
        'delivered',
        'cancelled',
        'schedule_return',
        'returned',
        'approve_return',
        'shipped'
    ]

    if(status && allowedStatus.includes(status))
        query.status = status

    const orders = await Order.find(query).populate('product').sort({createdAt: -1})

    return res.status(200).json({
        status: true,
        count: orders.length,
        orders
    })

})

module.exports= {
    getOrders
}