const { asyncHandler } = require('../utils/asyncHandler');
const { ApiError } = require('../utils/ApiError');
const { Product } = require('../models/product.models');


const showPopular = asyncHandler(async(req, res)=>{
    const limit = 30; // We show only 30 top products
    const products = await Product.find().limit(limit).sort({popularity:-1});
    if (products.length === 0) throw new ApiError(404, 'No popular products found');
    return res.status(200).json({
        success:true,
        products
    })
});

module.exports = {
    showPopular
}