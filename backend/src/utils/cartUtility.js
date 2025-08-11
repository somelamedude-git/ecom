const { Buyer } = require('../models/user.models');
const { Product } = require('../models/product.models');
const { asyncHandler } = require('./asyncHandler');
const { ApiError } = require('./ApiError');

const changeQuantUtil = asyncHandler(async(req, res, next)=>{ // use as a middleware
    console.log('entered changeQuantUtil');
    const user_id = req.user._id;
    const {product_id} = req.params;
    const {size} = req.body;

    const user = await Buyer.findById(user_id.toString());
    if(!user) throw new ApiError(404, 'User not found');
    console.log('in quant util, user found');

    const cart = user.cart;
    console.log(cart);
    const itemIndex = cart.findIndex(item=>
        item.product.toString()===product_id.toString() &&
        item.size===size
    );

    if(itemIndex===-1){
        throw new ApiError(400, "The product does not exist in your cart");
    }

    const product = await Product.findById(product_id.toString());
    if(!product){
        throw new ApiError(404, 'The product you are requesting for does not exist');
    }
    console.log(product);

    const stock = product.stock.get(size);
    console.log(stock);

   req.itemIndex = itemIndex;
   req.stock = stock;

   next();
})

module.exports = {
    changeQuantUtil
}