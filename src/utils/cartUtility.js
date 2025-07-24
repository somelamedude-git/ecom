const { Buyer } = require('../models/user.models');
const { Product } = require('../models/product.models');
const { asyncHandler } = require('./asyncHandler');
const { ApiError } = require('./ApiError');

const changeQuantUtil = asyncHandler(async(req, res, next)=>{ // use as a middleware
    const user_id = req.user._id;
    const {product_id} = req.params;
    const {size} = req.body;

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

    const stock = product.stock.get(size);

   req.alreadyInCart = alreadyInCart;
   req.stock = stock;

   next();
})

module.exports = {
    changeQuantUtil
}