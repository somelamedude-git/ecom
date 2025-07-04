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


module.exports = {
    addOrder,
    addOrderFromCart
}