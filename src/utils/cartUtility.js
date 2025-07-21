const { Buyer } = require('../models/user.models');
const { Product } = require('../models/product.models');
const { asyncHandler } = require('./asyncHandler');
const { ApiError } = require('./ApiError');

const changeQuantUtil = asyncHandler(async(user_id, product_id, size)=>{
    const user = await Buyer.findById(user_id);
    if(!user) throw new ApiError(404, 'User not found');

    const cart = user.cart;
    const alreadyInCart = cart.find(item=>
        item.product.toString()===product_id &&
        item.size===size
    );

    if(!alreadyInCart){
        throw new ApiError(400, "The product does not exist in your cart");
    }

    const product = await Product.findById(product_id);
    if(!product){
        throw new ApiError(404, 'The product you are requesting for does not exist');
    }

    const product_stock_helper = product.variants.find(item=>
        item.size === size
    )
    const stock = product_stock_helper.stock;

    return {
        alreadyInCart,
        stock
    }
})

module.exports = {
    changeQuantUtil
}