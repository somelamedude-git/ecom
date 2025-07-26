const { Product } = require('../models/product.models');
const { asyncHandler } = require('../utils/asyncHandler');
const { ApiError } = require('../utils/ApiError');
const { Seller } = require('../models/user.models')

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

const fetchSellerProducts = asyncHandler(async(req, res)=>{
    const user_id = req.user._id;
    const user = await Seller.findById(user_id).select("selling_products").populate("selling_products.product").lean(); // We are only reading, no need for shmancy mongoose <3

    if(!user) throw new ApiError(404, 'User not found');
    const productsOfUser = user.selling_products.map(item => item.product);

    return res.status(200).json({
        success: true,
        productsOfUser
    });
});

const productAnalysis = asyncHandler(async(req, res)=>{
    const user_id = req.user._id;
    const user = await Seller.findById(user_id).select("_id");
    if(!user) throw new ApiError(404, 'User not found');
    const { product_id } = req.param;

    const product = await Product.findById(product_id).select("owner views times_ordered added_to_cart")
    
})

module.exports = {
    fetchSingleProduct,
    fetchSellerProducts,
    productAnalysis
}