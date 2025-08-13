const { razorpay } = require('../config/razorpay');
const { asyncHandler } = require('../utils/asyncHandler');
const { Order } = require('../models/order.models');
require('dotenv').config({ path: '../.env' });

const payment_db_save = asyncHandler(async(req, res)=>{
    const user_id = req.user._id;
    const { order_id } = req.params;

    const order = await Order.findOne({ _id:order_id, customer:user_id })
    .populate("orderItems.product");

    if(!order){
        throw new ApiError(404, "Order not found");
    }

    const options = {
        amount: order.total*100, //It needs the amount to be in paisa
        currency: "INR",
        receipt: order._id.toString(), //I'll change it
        payment_capture: 1
    }

    const response = await razorpay.orders.create(options);
    res.status(201).json({
        order_id:response.id,
        success:true,
        currency:response.currency,
        amount:response.amount,
        key: process.env.razor_key
    });
});

const refund = asyncHandler(async(req, res)=>{
  const {paymentId, amount} = req.body;
  if(!paymentId) throw new ApiError(400, 'Bad request');
  const options = {};

  if(!amount){
    options.amount = amount*100
  }

  const refundResponse = await razorpay.payments.refund(paymentId, options);
  
  res.status(200).json({
      success: true,
      message: 'Refund initiated successfully.',
      refundId: refundResponse.id,
      status: refundResponse.status,
      refundDetails: refundResponse,
    });
})

const updatePaymentStatus = asyncHandler(async (req, res) => {
    const payload = JSON.parse(req.rawBody.toString())

  if (payload.event === 'payment_captured') {
    const payment = payload.payload.payment.entity
    const razorpayOrderId = payment.order_id
    const paymentId = payment.id

    const order = await Order.findOne({ razorpayOrderId })

    if (order) {
      order.paymentVerified = true
      order.paymentId = paymentId
      order.status = 'confirmed'
      await order.save()

      return res.status(200).json({ status: true, message: 'Payment updated', order })
    } else {
      return res.status(404).json({ status: false, message: 'Order not found' })
    }
  }

  res.status(200).json({ status: false, message: 'Unhandled event' })
})

let razorpayInstance = null;

if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  const Razorpay = require('razorpay');
  razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
} else {
  console.warn("⚠ Razorpay keys missing — payment routes will be disabled.");
}

module.exports = razorpayInstance;



module.exports = {
    payment_db_save,
    refund,
    updatePaymentStatus,
    razorpayInstance
}