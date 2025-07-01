const {asyncHandler} = require('../utils/asyncHandler')
const Order = require('../models/order.models')
const {Buyer} = require('../models/user.models')

const addOrder = asyncHandler(async (req, res) => {
  const { customerId } = req.query;

  const customer = await Buyer.findById(customerId).populate('cart.product');

  if (!customer)
    return res.status(400).json({ status: false, message: "No Buyer found" });

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

const returnOrder = asyncHandler(async (req, res) => {
    const {customerId, orderId} = req.query

    const order = await Order.findById(orderId)
    if(order.customer !== customerId)
        return res.status(404).json({status: false, message: "Order not found"})

    order.status = 'returned'
    await order.save()

    return res.status(200).json({status: true, message: "Order returned", order})
    
})


module.exports = {
    addOrder,
    returnOrder
}