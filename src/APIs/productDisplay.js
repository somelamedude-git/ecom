const { Product } = require('../models/product.models');
const { asyncHandler } = require('../utils/asyncHandler');
const { ApiError } = require('../utils/ApiError');

const fetchProducts = asyncHandler(async (req, res)=>{
    const limit = Math.min((Number(req.query.limit) || 100), 100);
    const products = await Product.find().limit(limit). populate('category').populate('owner', 'name email');

    if(products.length == 0){
        throw new ApiError(404, "Products not found");
    }

    res.status(200).json({
        products
    });
});

//Use this for dashboard, search, wishlist and cart

module.exports = {
    fetchProducts
}