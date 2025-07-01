const {asyncHandler} = require('../utils/asyncHandler')
const Order = require('../models/order.models')

const addOrder = asyncHandler (async(req, res) => {
    const {customer, orderItems, address} = req.body;

    if(!orderItems)
        return res.status(400).json({status: false, message: "No order added"})

    let price = 0
    for(let i of orderItems)
        price += i.order_amount

    const order = new Order({customer, price, orderItems, address})

    await order.save()
    return res.status(201).json({status: true, message: "Order created successfully"})

})

const deleteOrder = asyncHandler(async (req, res) => {
    const {orderId, itemId} = req.body;

    const order = await Order.findOne({_id: orderId})

    if(!order)
        return res.status(400).json({status: false, message: "Order not found"})

    const originalLength = order.orderItems.length
    order.orderItems = order.orderItems.filter(item => item._id.toString() !== itemId)

    if (order.orderItems.length === originalLength) 
        return res.status(404).json({ status: false, message: "Item not found in order" });

    await order.save()

    return res.status(200).json({
        status: true,
        message: "Item removed from order",
        updatedOrder: order
    });

})

module.exports = {
    addOrder,
    deleteOrder
}