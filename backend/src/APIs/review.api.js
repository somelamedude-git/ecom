const { asyncHandler } = require('../utils/asyncHandler');
const { ApiError } = require('../utils/ApiError');
const { Product } = require('../models/product.models');
const { Buyer } = require('../models/user.models');
const { Review } = require('../models/reviews.model');
const { handleTransaction } = require('../utils/handleTransaction');

const addReview = asyncHandler(async(req, res)=>{
    const user_id = req.user._id;
    const { product_id } = req.params;
    const { review_desc, review_rating } = req.body;
    let review = null;

    const result = await handleTransaction(async(session)=>{
    const user = await Buyer.findById(user_id).select("reviews_added").session(session);
    if(!user) throw new ApiError(404, 'User not found');

    const product = await Product.findById(product_id).select("reviews owner").session(session);

    if(!product){
        throw new ApiError(404, 'Product not found');
    }

   review= await Review.create({
        description: review_desc,
        product_reviewed: product_id,
        owner_of_product: product.owner,
        rating: review_rating,
        user_reviewed: user_id
    }, {session});


    user.reviews_added.push(review._id);
    await user.save({ session });

    product.reviews.push(review._id);
    await product.save({ session });

    })

    res.status(200).json({
        success: true,
        message: "review saved",
        review
    });
});


const fetchReviews = asyncHandler(async(req, res)=>{
    const { product_id } = req.params;
    const product = await Product.findById(product_id).select("reviews").populate("reviews"); // array of schema
    const product_reviews = product.reviews;
    if(!product) throw new ApiError(404, 'Product not found');
    res.status(200).json({
        success: true,
        reviews: product_reviews
    });
});

module.exports = {
    addReview,
    fetchReviews
}