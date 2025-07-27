const { asyncHandler } = require('../utils/asyncHandler');
const { ApiError } = require('../utils/ApiError');
const { Product } = require('../models/product.models');
const { Buyer } = require('../models/user.models');

const addReview = asyncHandler(async(req, res)=>{
    const user_id = req.user._id;
    const user = await Buyer.findById(user_id).select("");
    const { product_id } = req.params;
    const { review_desc, review_rating } = req.body;
    if(!user) throw new ApiError(404, 'User not found');

    const product = await Product.findById(product_id).select("reviews");

    if(!product){
        throw new ApiError(404, 'Product not found');
    }

   const review= await Review.create({
        description: review_desc,
        product_reviewed: product_id,
        owner_of_product: product.owner,
        rating: review_rating
    });

    user.reviews_added.push(review._id);
    await user.save();

    product.reviews.push(review._id);
    await product.save();

    res.status(200).json({
        success: true,
        message: "review saved"
    })
});

module.exports = {
    addReview
}