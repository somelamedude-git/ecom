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

module.exports = {
    addOrder
}