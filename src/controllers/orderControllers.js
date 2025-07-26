const { asyncHandler } = require("../utils/asyncHandler");
const { Buyer, Seller } = require('../models/user.models')
const { Order } = require('../models/order.models')
const { Product } = require('../models/product.models');
const { ApiError } = require("../utils/ApiError");
const { handleTransaction } = require('../utils/handleTransaction');

const addOrder = asyncHandler(async (req, res) => {
    const { productId, quantity, size } = req.body;
    const customerId = req.user._id;

    if (!customerId || !productId) {
        throw new ApiError(404, 'Bad request');
    }

    const result = await handleTransaction(async (session) => {
        const customer = await Buyer.findById(customerId).session(session);
        const product = await Product.findById(productId).session(session);

        if (!product || !customer) {
            throw new ApiError(404, 'Product or customer not found');
        }

        const product_owner = await Seller.findById(product.owner).session(session);

        if (!product.stock.has(size)) {
            throw new ApiError(400, 'Invalid size selected');
        }

        const available = product.stock.get(size);
        if (available - quantity < 0 || quantity < 1) {
            throw new ApiError(400, 'Invalid quantity');
        }

        const total = product.price * quantity;

        const order = new Order({
            customer: customerId,
            product: productId,
            quantity,
            total,
            size,
        });

        product_owner.order_quo.push(order._id);
        product.stock.set(size, available - quantity);
        customer.cart = customer.cart.filter(item => item.product.toString() !== productId);
        customer.orderHistory.push([order._id]);

        product.average_age_customers = (
            (product.average_age_customers * product.times_ordered + customer.age) /
            (product.times_ordered + 1)
        );
        product.times_ordered++;

        await order.save({ session });
        await product.save({ session });
        await customer.save({ session });
        await product_owner.save({ session });

        return order;
    });

    return res.status(201).json({
        status: true,
        message: `Order ${result._id} placed`,
        order: result
    });
});

//Push back into orderHistory on the customer's end for recommendation system

const addOrderFromCart = asyncHandler(async (req, res) => {
  const customerId = req.user._id;

  const customer = await Buyer.findById(customerId);

  if (!customer || !customer.cart || customer.cart.length === 0)
    return res.status(404).json({ status: false, message: "Cart is empty or customer not found" });

  const errors = [];
  const successOrders = [];

  const result = await handleTransaction (async (session) => {
    await Promise.all(customer.cart.map(async (item) => {
      const product = await Product.findById(item.product).session(session);
      product.average_age_customers = (((product.average_age_customers*product.times_ordered)+customer.age)/(product.times_ordered+1));
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
      await product.save({session});
      await order.save({session});

      successOrders.push(order._id);
  }));

  customer.cart = [];
  customer.orderHistory.push(successOrders);
  await customer.save({session});
  })


  return res.status(201).json({
    status: true,
    message: "Order processing completed",
    ordersPlaced: successOrders.length,
    errors,
    successOrders,
    result
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

const schedule_return = asyncHandler(async (req, res) => {
    const { orderId } = req.query;
    const customerId = req.user._id;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const order = await Order.findById(orderId)
            .select('status customer product')
            .populate('product')
            .session(session);

        const customer = await Buyer.findById(customerId).session(session);

        if (!order || !customer || order.customer.toString() !== customerId.toString())
            throw new ApiError(404, 'Order not found');

        if (order.status !== 'pending')
            throw new ApiError(400, 'Bad request');

        if (!order.product)
            throw new ApiError(500, 'Product data not found');

        order.status = 'schedule_return';
        order.product.times_returned++;

        await order.save({ session });
        await order.product.save({ session });

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
            status: true,
            message: `Order ${orderId} scheduled for return`
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
});


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