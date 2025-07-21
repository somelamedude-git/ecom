const { Buyer } = require('../models/user.models');
const { asyncHandler } = require('../utils/asyncHandler');
const { ApiError } = require('../utils/ApiError');
const { Product } = require('../models/product.models');

const addToBag = asyncHandler(async (req, res) => {
    const user_id = req.user._id;
    const user_ = await Buyer.findById(user_id);
    if (!user_) throw new ApiError(404, 'User not found');

    const { product_id } = req.params;
    const { size_ } = req.body;

    if (!size_) throw new ApiError(400, 'Size is required');

    const product = await Product.findById(product_id);
    if (!product) throw new ApiError(404, 'Product not found');

    const product_info = product.variants.find(v => v.size === size_);
    if (!product_info) throw new ApiError(400, 'Invalid size');

    if (product_info.stock === 0) {
        throw new ApiError(409, 'Product out of stock');
    }

    const alreadyInCart = user_.cart.find(item =>
        item.product.toString() === product_id &&
        item.size === size_
    );

    if (alreadyInCart) {
        throw new ApiError(409, 'Product with this size already in cart');
    }

    user_.cart.push({ product: product._id, quantity: 1, size: size_ });
    await user_.save();

    res.status(200).json({
        success: true,
        product_id: product._id,
        message: "Product added to cart",
        size: size_,
        count_bought: 1
    });
});

const incrementItem = asyncHander(async(req, res)=>{
    const user_id = req.user._id;
    const user = await Buyer.findById(user_id);
    
    if(!user){
        throw new ApiError(404, 'User not found');
    }
    const {product_id} = req.params;
    const {size} = req.body;

    const cart = user.cart;
    const alreadyInCart = cart.find(item=>
        item.product.toString()===product_id &&
        item.size===size
    )

    if(!alreadyInCart){
        throw new ApiError(400, 'The item does not exist in your cart');
    }

    const product = await Product.findById(product_id);

    const item_stock_helper = product.variants.find(item=>
        item.size === size
    );

    const stock = item_stock_helper.stock;

    if(alreadyInCart.quantity+1>stock){
        throw new ApiError(409, 'Item demand more than the stock available');
    }

    alreadyInCart.quantity++;
    await user.save();

    return res.status(200).json({
        success:true
    });
});


module.exports = {
    addToBag,
    incrementItem
};
