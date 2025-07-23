const { Buyer } = require('../models/user.models');
const { asyncHandler } = require('../utils/asyncHandler');
const { ApiError } = require('../utils/ApiError');
const { Product } = require('../models/product.models');

const addToWishList = asyncHandler(async(req, res)=>{ // I want to merge this with addToCart, i WILL modularize this, but then an enum is needed
    const user_id = req.user._id;
    const user = await Buyer.findById(user_id).select('+wishlist');

    if(!user){
        throw new ApiError(404, 'User not found');
    }
    const { size } = req.body;
    const { product_id } = req.query;

    const product = await Product.findById(product_id);
    if(!product){
        throw new ApiError(404, 'Product not found');
    }

    const existingItem = user.wishlist.find((item)=>
    (item.product.toString()===product_id && item.size===size)
    )

    if(existingItem){
        throw new ApiError(409, 'The product already exists in the cart');
    }

    user.wishlist.push({
        product: product_id,
        size: size
    });

    user.save();

    return res.status(200).json({
        success: true,
        message: 'Item added to wishlist successfully',
    })
});

module.exports = {
    addToWishList
}