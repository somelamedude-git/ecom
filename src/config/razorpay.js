const { asyncHandler } = require('../utils/asyncHandler');
const { ApiError } = require('../utils/ApiError');
const Razorpay = require('razorpay');
require('dotenv').config({ path: '../.env' });


const razorpay = new Razorpay({
    key_id:process.env.razor_key,
    key_secret:process.env.razor_secret
})

module.exports = {razorpay}
