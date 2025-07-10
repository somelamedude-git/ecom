const { asyncHandler } = require("../utils/asyncHandler");
const { Buyer } = require('../models/user.models')
const { Order } = require('../models/order.models')
const { Product } = require('../models/product.models')

const addOrder = asyncHandler(async(req, res) => {
    const { productId, quantity} = req.body;
    const customerId = req.user._id

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
})//to be only use with "buy now"

const addOrderFromCart = asyncHandler(async (req, res) => {
  const customerId = req.user._id;

  const customer = await Buyer.findById(customerId);

  if (!customer || !customer.cart || customer.cart.length === 0)
    return res.status(404).json({ status: false, message: "Cart is empty or customer not found" });

  const errors = [];
  const successOrders = [];

  await Promise.all(customer.cart.map(async (item) => {
    try {
      const product = await Product.findById(item.product);

      if (!product || product.stock < item.quantity) {
        errors.push({ product: item.product, message: "Insufficient stock or product not found" });
        return;
      }

      const order = new Order({
        customer: customerId,
        product: product._id,
        quantity: item.quantity,
      });

      product.stock -= item.quantity;
      await product.save();
      await order.save();

      successOrders.push(order._id);
    } catch (err) {
      errors.push({ product: item.product, message: err.message });
    }
  }));

  customer.cart = [];
  await customer.save();

  return res.status(201).json({
    status: true,
    message: "Order processing completed",
    ordersPlaced: successOrders.length,
    errors,
    successOrders
  });
});

const cancelOrder = asyncHandler(async(req, res) => {
    const {orderId} = req.query.orderId;
    const customerId = req.user._id;

    const order = await Order.findById(orderId)
    const customer = await Buyer.findById(customerId)

    if(!order || !customer || order.customer.toString() !== customerId.toString())
        return res.status(404).json({status: false, message: "Order not found"})
    if(order.status !== 'pending')
        return res.status(400).json({status: false, message: "Bad request"})
    order.status = 'cancelled'
    await order.save()

    const product = await Product.findById(order.product)
    if(!product)
        return res.status(400).json({status: false, message: "Product not found"})
    product.stock += order.quantity

    await product.save()

    return res.status(200).json({status: true, message: "Order cancelled"})

})

const schedule_return = asyncHandler(async(req, res) => {
    const {orderId} = req.query;
    const customerId = req.user._id;

    const order = await Order.findById(orderId)
    const customer = await Buyer.findById(customerId)

    if(!order || !customer || order.customer.toString() !== customerId.toString())
        return res.status(404).json({status: false, message: "Order not found"})

    if(order.status !== 'pending')
        return res.status(400).json({status: false, message: "Bad request"})

    order.status = 'schedule_return'
    await order.save()

    return res.status(200).json({status: false, message: `Order ${orderId} scheduled for return`})

})

const approve_return = asyncHandler(async (req, res) => {
    const {orderId} = req.query;

    const order = await Order.findById(orderId)

    if(!order)
        return res.status(404).json({status: false, message: "Order not found"})

    if(order.status !== 'schedule_return')
        return res.status(400).json({status: false, message: "Bad request"})

    order.status = 'approve_return'
    await order.save()

    return res.status(200).json({status: true, message: `Order ${orderId} approved for return`})
})

const returned = asyncHandler(async(req, res) => {
    const {orderId} = req.query;

    const order = await Order.findById(orderId)

    if(!order)
        return res.status(404).json({status: false, message: "Order not found"})

    if(order.status !== 'approve_return')
        return res.status(400).json({status: false, message: "Bad request"})

    order.status = 'returned'
    await order.save()

    return res.status(200).json({status: true, message: `Order ${orderId} returned`})
}) //for delivery partners

const reached_return = asyncHandler(async(req, res) => {
    const {orderId} = req.query;

    const order = await Order.findById(orderId)

    if(!order)
        return res.status(404).json({status: false, message: "Order not found"})

    if(order.status !== 'returned')
        return res.status(400).json({status: false, message: "Bad request"})

    order.status = 'reached_return'
    await order.save()

    const product = await Product.findById(order.product)
    product.stock += order.quantity

    await product.save()

    return res.status(200).json({status: true, message: `Order ${orderId} reached`})
})//for seller

module.exports = {
    addOrder,
    addOrderFromCart,
    cancelOrder,
    schedule_return,
    approve_return,
    returned,
    reached_return
}