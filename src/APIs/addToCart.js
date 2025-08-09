const { Buyer } = require('../models/user.models');
const { asyncHandler } = require('../utils/asyncHandler');
const { ApiError } = require('../utils/ApiError');
const { Product } = require('../models/product.models');

const addToBag = asyncHandler(async (req, res) => {
    console.log('Entered addToBag');
    const user_id = req.user._id;
    const user_ = await Buyer.findById(user_id.toString());
    
    if (!user_) throw new ApiError(404, 'User not found');

    const { product_id } = req.params;
    const { size_ } = req.body;

    if (!size_) throw new ApiError(400, 'Size is required');

    const product = await Product.findById(product_id);
    if (!product) throw new ApiError(404, 'Product not found');
    const sizes = Array.from(product.stock.keys());
    if (!sizes.includes(size_)) {
    throw new ApiError(400, 'Invalid size selected');
}
     const stock_of_product = product.stock.get(size_) //Stored as a number and map datatype, finally a smart decision

    if (stock_of_product === 0) {
        throw new ApiError(409, 'Product out of stock, you may add it to your wishlist');
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

   product.added_to_cart = (product.added_to_cart || 0) + 1;
    await product.save();

    res.status(200).json({
        success: true,
        product_id: product._id,
        message: "Product added to cart",
        size: size_,
        count_bought: 1
    });
});

const incrementItem = asyncHandler(async(req, res)=>{
    const alreadyInCart = req.alreadyInCart;
    const stock = req.stock;
    const user_id = req.user._id;
    const user = await Buyer.findById(user_id.toString());

    if(alreadyInCart.quantity+1>stock){
        throw new ApiError(400, 'This product is not available in the quantity you requested');
    }
    alreadyInCart.quantity++;
    await user.save();
    res.status(200).json({
        success: true
    })
});

const decrementItem = asyncHandler(async(req, res)=>{
    const alreadyInCart = req.alreadyInCart;
    const user_id = req.user._id;

    const user = await Buyer.findById(user_id.toString());

    if(alreadyInCart.quantity-1 <0){
        throw new ApiError(409, 'Item quantity cannot be negative');
    }
    alreadyInCart.quantity--;
    await user.save();

    res.status(200).json({
        success:true
    })
});

const deleteItem = asyncHandler(async(req, res)=>{
    const { product_id } = req.params;
    const product = await Product.findById(product_id.toString());
    if(!product){
        throw new ApiError(404, 'Product not found');
    }
    const { size } = req.body;
    const user_id = req.user._id // we need to save the user's data so, well, yes
    const user = await Buyer.findById(user_id.toString());

    if(!user){
        throw new ApiError(404, 'User not found');
    }

    user.cart = user.cart.filter((item)=>
       ! (item.product.toString() === product_id && item.size === size)
    )
    await user.save();

    res.status(200).json({success:true, message: "Item removed from cart" });

})

module.exports = {
    addToBag,
    incrementItem,
    decrementItem,
    deleteItem
};
// Please rememer ki changeCartUtil is a MIDDLEWARE