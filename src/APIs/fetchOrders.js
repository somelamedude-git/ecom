const { Order } = require("../models/order.models");
const { Buyer } = require("../models/user.models");
const { ApiError } = require("../utils/ApiError");
const { asyncHandler } = require("../utils/asyncHandler");

const getOrders = asyncHandler(async(req, res)=>{
    const user_id = req.user._id;
    const {status} = req.query
    const user = await Buyer.findById(user_id).populate({
        path: 'orderHistory',
        populate: {
            path: '$',
            model: 'Order'
        }
    }).select('orderHistory');

    if(!user) throw new ApiError(404, 'User not found');

    let orders = user.orderHistory

    if(status)
        orders = orders.map(batch => batch.filter(order => order.status === status))
                       .filter(batch => batch.length > 0)

    res.status(200).json({status: true, orders})
})

// const getOrders = asyncHandler(async (req, res) => {
//     const user = req.user._id
//     const {status} = req.query

//     const customer = await BaseUser.findById(user)

//     if(!customer)
//         throw new ApiError(404, "User not found")

//     let query = {
//         customer: customer._id
//     }

//     const allowedStatus = [
//         'pending',
//         'delivered',
//         'cancelled',
//         'schedule_return',
//         'returned',
//         'approve_return',
//         'shipped'
//     ]

//     if(status && allowedStatus.includes(status))
//         query.status = status

//     const orders = await Order.find(query).populate('product').sort({createdAt: -1})

//     return res.status(200).json({
//         status: true,
//         count: orders.length,
//         orders
//     })

// })

module.exports= {
    getOrders
}