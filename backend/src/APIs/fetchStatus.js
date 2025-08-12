const {asyncHandler} = require('../utils/asyncHandler')
const {Order} = require('../models/order.models');
const { Buyer } = require('../models/user.models');

const fetchStatus = asyncHandler(async(req, res) => {
    const {orderId} = req.body.orderId;
    const uid = req.user._id;

    const order = await Order.findById(orderId)
    const user = await Buyer.findById(order.customer)

    if(user.toString() != uid.toString())
        return res.status(400).json({status: false, message: "Bad request"})

    return res.status(200).json({status: true, orderStatus: order.status})
})

module.exports = {
    fetchStatus
}