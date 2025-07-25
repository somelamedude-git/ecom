const { Product } = require('../models/product.models');
const { asyncHandler } = require('../utils/asyncHandler');
const { ApiError } = require('../utils/ApiError');

const fetchSingleProduct = asyncHandler(async(req, res)=>{
    const { product_id } = req.params;
    const product = await Product.findByIdAndUpdate(product_id,
        { $inc: {views: 1}}, { new: true }
    ).select("description name views productImages price stock").lean();

    if(!product){
        throw new ApiError(404, 'Product not found');
    }

    const sizes_available = Object.keys(product.stock || {});// Map this and arrange it in the frontend as the buttons, and re-render the well stock
    // The whole map of stocks will be exported btw

    return res.status(200).json({
        success: true,
        product_info: product,
        product_sizes: sizes_available
    });
});

module.exports = {
    fetchSingleProduct
}