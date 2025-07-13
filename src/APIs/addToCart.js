const { Buyer } = require('../models/user.models');
const { asyncHandler } = require('../utils/asyncHandler');
const { ApiError } = require('../utils/ApiError');
const { Product } = require('../models/product.models');

const addToBag = asyncHandler(async (req, res) => {
    const user_id = req.user._id;
    const user_ = await Buyer.findById(user_id);

    if (!user_) {
        throw new ApiError(404, 'User not found');
    }

    const { product_id } = req.params;
    const product = await Product.findById(product_id);

    if (!product) {
        throw new ApiError(404, 'Product not found');
    }

    if (product.stock === 0) {
        throw new ApiError(409, 'Product out of stock');
    }

    let count_bought;
    const existingItem = user_.cart.find(item => item.product.toString() === product._id.toString());

    if (existingItem) {
        existingItem.quantity += 1;
        count_bought = existingItem.quantity;
    } else {
        user_.cart.push({ product: product._id, quantity: 1 });
        count_bought = 1;
    }

    await user_.save();

    res.status(200).json({
        success: true,
        product_id: product._id,
        message: "Product added to cart",
        count_bought
    });
});

module.exports = {
    addToBag
};
