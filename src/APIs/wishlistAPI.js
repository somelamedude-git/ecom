const { Buyer } = require('../models/user.models');
const { asyncHandler } = require('../utils/asyncHandler');
const { ApiError } = require('../utils/ApiError');
const { Product } = require('../models/product.models');

const addToWishList = asyncHandler(async(req, res)=>{
    const user_id = req.user._id;
    const user = await Buyer.findById(user_id);

    if(!user){
        throw new ApiError(404, 'User not found');
    }
    const { size } = req.body;
    const { product_id } = req.query;

    const product = await Product.findById(product_id);
    if(!product){
        throw new ApiError(404, 'Product not found');
    }

    const stock


});

module.exports = {
    addToWishList
}