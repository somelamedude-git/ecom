const { Order } = require('../models/order.models');
const { Seller } = require('../models/user.models');
const { asyncHandler } = require('../utils/asyncHandler');
const { ApiError } = require('../utils/ApiError');
const { serializeUser } = require('passport');

const fetchSalesMap = asyncHandler(async(req, res)=>{ // Here we return a map instead of a stupid array
    const seller_id = req.user._id;
    const seller = await Seller.findById(seller_id).select("order_quo").populate("order_quo");

    const salesByDate = {};

    seller.order_quo.forEach(order =>{
        const dateStr = new Date(order.createdAt).toISOString().split('T')[0];
        if(salesByDate[dateStr]){
            salesByDate[dateStr]++;
        }
        else{
            salesByDate[dateStr] = 1;
        }
    });

    res.status(200).json({
        success:true,
        salesByDate
    });
});

module.exports = {
    fetchSalesMap
}