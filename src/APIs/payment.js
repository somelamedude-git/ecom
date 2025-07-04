const { razorpay } = require('../config/razorpay');
const { asyncHandler } = require('../utils/asyncHandler');
const { Order } = require('../models/order.models');
require('dotenv').config({ path: '../.env' });
const crypto = require('crypto');

const payment_db_save = asyncHandler(async(req, res)=>{
    const user_id = req.user._id;
    const { order_id } = req.params;

    const order = await Order.findOne({ _id:order_id, customer:user_id })
    .populate("orderItems.product");

    if(!order){
        throw new ApiError(404, "Order not found");
    }

    const options = {
        amount: order.price*100, //It needs the amount to be in paisa
        currency: "INR",
        receipt: "Kill me", //I'll change it
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

const webHook = asyncHandler(async (req, res) => {
  const secret = process.env.razor_secret;
  
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(req.rawBody)
    .digest('hex');

  const razorSignature = req.headers['x-razorpay-signature'];

  if (expectedSignature === razorSignature) {
    res.status(200).json({ success: true });
  } else {
    res.status(400).json({ success: false, message: 'Invalid signature' });
  }
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


module.exports = {
    payment_db_save,
    webHook,
    refund
}