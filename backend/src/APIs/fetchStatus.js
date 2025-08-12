const {asyncHandler} = require('../utils/asyncHandler')
const {Order} = require('../models/order.models');
const { Buyer } = require('../models/user.models');

const fetchStatus = asyncHandler(async(req, res) => {
    const {orderId} = req.body;
    const uid = req.user._id;

    const order = await Order.findById(orderId)
    if (!order) {
        return res.status(404).json({status: false, message: "Order not found"})
    }

    const user = await Buyer.findById(order.customer)
    if (!user) {
        return res.status(404).json({status: false, message: "User not found"})
    }

    if(user._id.toString() !== uid.toString())
        return res.status(400).json({status: false, message: "Unauthorized access"})

    return res.status(200).json({status: true, orderStatus: order.status, order: order})
})

module.exports = {
    fetchStatus
}