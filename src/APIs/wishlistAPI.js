const { Buyer } = require('../models/user.models');
const { asyncHandler } = require('../utils/asyncHandler');
const { ApiError } = require('../utils/ApiError');
const { Product } = require('../models/product.models');

const addToWishList = asyncHandler(async(req, res)=>{ 
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

    await user.save();

    return res.status(200).json({
        success: true,
        message: 'Item added to wishlist successfully',
    })
});

const removeFromWL = asyncHandler(async(req, res)=>{
    const user_id = req.user._id;
    const user = await Buyer.findById(user_id).select('wishlist');
    
    if(!user) throw new ApiError(404, 'User not found');
    const { product_id } = req.params;
    const { size } = req.body;

    const itemInList = user.wishlist.find((item)=>
    (item.product.toString()===product_id && item.size===size)
    )

    if(!itemInList){
        throw new ApiError(400, 'Bad request');
    }

    user.wishlist = user.wishlist.some((item)=>
    !(item.product.toString()===product_id && item.size===size)
    )

    await user.save();

    return res.status(200).json({
        success:true,
        message: 'Item removed successfully'
    })
 });

 const fetchWishList = asyncHandler(async (req, res) => {
    const user_id = req.user._id;
    const user = await Buyer.findById(user_id).populate("wishlist.product");
    if (!user) throw new ApiError(404, 'User not found');

    const return_array = user.wishlist.map(item => {
        const inStock = item.product && item.product.stock?.get(item.size) > 0;
        return { item, inStock };
    });

    return res.status(200).json({
        success: true,
        wish_length: user.wishlist.length,
        wish_items_info: return_array
    });
});


module.exports = {
    addToWishList,
    removeFromWL,
    fetchWishList
}