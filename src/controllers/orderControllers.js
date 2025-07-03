const {asyncHandler} = require('../utils/asyncHandler')
const { Order }= require('../models/order.models')
const {Buyer} = require('../models/user.models')
const { ApiError } = require('../utils/ApiError')


const addOrder = asyncHandler(async (req, res) => {
  const customerId = req.user._id;

  const customer = await Buyer.findById(customerId).populate('cart.product');

  if (!customer)
    throw new ApiError(404, 'User not found');

  if (customer.cart.length === 0)
    return res.status(400).json({ status: false, message: "Cart is empty" });

 
  const orderItems = customer.cart.map(item => ({
    product: item.product._id,       
    quantity: item.quantity,
    price: item.product.price        
  }));

  
  const totalPrice = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );

  await Promise.all(orderItems.map(async (item) => {
    const product = await Product.findById(item.product);

    if (!product) {
        throw new ApiError(404, `product with id ${item.product} not found`);
    }

    if (product.stock < item.quantity) {
        throw new ApiError(409, `product with id ${item.product} out of stock`)
    }

    product.stock -= item.quantity;
    await product.save();
  }));
  
  const order = new Order({
    customer: customer._id,
    price: totalPrice,
    orderItems,
    address: customer.address, 
    status: 'pending'
  });

  await order.save();

  
  customer.orderHistory.push(order._id);
  customer.cart = [];
  await customer.save();

  return res.status(201).json({
    status: true,
    message: "Order added successfully",
    order
  });
});

const schedule_return = asyncHandler(async(req, res) => {
    const {orderId, customerId} = req.query
    const order = await Order.findById(orderId)

    if(!order)
        throw new ApiError(404, `Order not found`)

    if(order.customer !== customerId)
        throw new ApiError(400, `Order not found for this customer`);

    order.status = 'schedule_return'
    order.save()

    return res.status(200).json({status: true, message: `Order id ${orderId} scheduled for return`})
}) //approve return in seller controllers

const returnOrder = asyncHandler(async (req, res) => {
  const customerId = req.user._id;
  const { orderId } = req.params;

  const order = await Order.findById(orderId);

  if(order.status === 'returned')
    throw new ApiError(400, `order ${orderId} already returned`)

  if (!order || !order.customer.equals(customerId)) {
    throw new ApiError(404, 'Order not found');
  }

  await Promise.all(order.orderItems.map(async (item) => {
    const product = await Product.findById(item.product);

    if (!product) {
        throw new ApiError(404, `product with id ${item.product} not found`);
    }

    product.stock += item.quantity;
    await product.save();
  }));

  order.status = 'returned';
  await order.save();

  return res.status(200).json({
    status: true,
    message: 'Order marked as returned',
    order
  });
});

module.exports = {
    addOrder,
    returnOrder,
    schedule_return
}