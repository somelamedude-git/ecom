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


module.exports = {
    payment_db_save
}