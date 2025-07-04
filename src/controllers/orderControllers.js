const { asyncHandler } = require("../utils/asyncHandler");
const { Buyer } = require('../models/user.models')
const { Order } = require('../models/order.models')
const { Product } = require('../models/product.models')

const addOrder = asyncHandler(async(req, res) => {
    const {customerId, productId, quantity} = req.body;

    if(!customerId || !productId)
        return res.status(400).json({status: false, message: "Bad request"})

    const customer = await Buyer.findById(customerId)
    const product = await Product.findById(productId)

    if(!customer || !product || product.stock-quantity < 0 || quantity < 1)
        return res.status(400).json({status: false, message: "Not found"})

    const order = new Order({
        customer: customerId,
        product: productId,
        quantity
    })

    product.stock -= quantity;
    await product.save()

    customer.cart = customer.cart.filter(item => item._id.toString() !== productId)
    await customer.save()

    await order.save()
    return res.status(201).json({status: true, message: `Order ${order._id} placed`, order})
})

module.exports = {
    addOrder
}