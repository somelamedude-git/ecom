const { asyncHandler } = require("../utils/asyncHandler");
const { Buyer, Seller } = require('../models/user.models')
const { Order } = require('../models/order.models')
const { Product } = require('../models/product.models');
const { ApiError } = require("../utils/ApiError");

const addOrder = asyncHandler(async(req, res) => {
    const { productId, quantity, size} = req.body;
    const customerId = req.user._id

    if(!customerId || !productId)
        return res.status(400).json({status: false, message: "Bad request"})

    const customer = await Buyer.findById(customerId)
    const product = await Product.findById(productId);
    product.times_ordered++;

    const product_owner = await Seller.findById(product.owner)

    if(!customer || !product || product.stock.get(size)-quantity < 0 || quantity < 1)
        return res.status(400).json({status: false, message: "Not found"});

    const total = product.price * quantity

    const order = new Order({
        customer: customerId,
        product: productId,
        quantity,
        total,
        size
    });
    product_owner.order_quo.push(order);
    await order.save();
    const currentQuantity = product.stock.get(size)
    product.stock.set(size, currentQuantity-quantity)
    await product.save();
    customer.cart = customer.cart.filter(item => item.product.toString() !== productId);
    await customer.save();
    customer.orderHistory.push([order._id]);
    await product_owner.save();
    return res.status(201).json({status: true, message: `Order ${order._id} placed`, order})
})//to be only use with "buy now"

//Push back into orderHistory on the customer's end for recommendation system

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
      product.times_ordered++;
     
      if (!product || product.stock.get(item.size) < item.quantity) {
        errors.push({ product: item.product, message: "Insufficient stock or product not found" });
        return;
      }

      const currentQuantity = product.stock.get(item.size)
      const total = item.quantity * product.price

      product.stock.set(item.size, currentQuantity - item.quantity)
      const order = new Order({
        customer: customerId,
        product: product._id,
        quantity: item.quantity,
        size: item.size,
        total
      });
      await product.save();
      await order.save();

      successOrders.push(order._id);
    } catch (err) {
      errors.push({ product: item.product, message: err.message });
    }
  }));

await Promise.all(successOrders.map(async (order_id)=>{
    const order_ = await Order.findById(order_id).populate("product.owner");
    const product_owner = order_.product.owner;

    product_owner.order_quo.push(order_);
    await product_owner.save();
}))

  customer.cart = [];
  customer.orderHistory.push(successOrders);
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
    const {orderId} = req.query;
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
    const current_stock = product.stock.get(order.size);
    product.stock.set(order.size, current_stock+order.quantity)

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

const shipped = asyncHandler(async(req, res) => {
    const {orderId} = req.query;

    const order = await Order.findById(orderId)

    if(!order)
        return res.status(404).json({status: false, message: "Order not found"})

    if(order.status !== 'pending')
        return res.status(400).json({status: false, message: "Bad request"})

    order.status = 'shipped'
    await order.save()

    return res.status(200).json({status: true, message: `Order ${orderId} shipped`})
})//for seller

module.exports = {
    addOrder,
    addOrderFromCart,
    cancelOrder,
    schedule_return,
    approve_return,
    returned,
    reached_return,
    shipped
}