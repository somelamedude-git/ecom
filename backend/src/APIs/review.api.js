const { asyncHandler } = require('../utils/asyncHandler');
const { ApiError } = require('../utils/ApiError');
const { Product } = require('../models/product.models');
const { Buyer } = require('../models/user.models');
const { Review } = require('../models/reviews.model');
const { handleTransaction } = require('../utils/handleTransaction');

const addReview = asyncHandler(async(req, res)=>{
    console.log('In addReview');
    const user_id = req.user._id;
    const { product_id } = req.params;

    let { description, rating } = req.body;
    console.log('Add reviw', description, rating);
    rating = Number(rating);
    let review = null;

    const result = await handleTransaction(async(session)=>{
    const user = await Buyer.findById(user_id.toString()).select("reviews_added").session(session);
    if(!user) throw new ApiError(404, 'User not found');

    const product = await Product.findById(product_id.toString()).select("reviews owner").session(session);
    console.log('Add review', product);

    if(!product){
        throw new ApiError(404, 'Product not found');
    }

   review= await Review.create([{
        description: description,
        product_reviewed: product_id,
        owner_of_product: product.owner,
        rating: rating,
        user_reviewed: user_id
    }], {session});

    console.log(review);


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
    const product = await Product.findById(product_id.toString()).select("reviews").populate("reviews"); // array of schema
    if(!product) throw new ApiError(404, 'Product not found');
    const product_reviews = product.reviews.filter(view=> view!==null)
    res.status(200).json({
        success: true,
        reviews: product_reviews
    });
});

module.exports = {
    addReview,
    fetchReviews
}