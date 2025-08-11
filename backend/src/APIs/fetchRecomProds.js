const { Product } = require('../models/product.models');
const { Buyer } = require('../models/user.models');
const { asyncHandler } = require('../utils/asyncHandler');
const { ApiError } = require('../utils/ApiError');
const { Tag } = require('../models/tags.model');
const { countSetBits } = require('./defaultRecom')

const fetchRecomProds = asyncHandler(async(req, res)=>{ // idiot, this is just for fetching the products
    const user_id = req.user._id;
    const user = await Buyer.findById(user_id.toString());

    if(!user){
        console.log('User not found');
        throw new ApiError(404, 'User not found');
    }

    // We can check the similarity by product masking, product bitMask is a string

    const products_ = await Product.find().select("bitmask _id").lean(); // No point in refetching, jo krna hai abhi karo
    const user_choice_bitmask = BigInt(user.recommend_masking);

    const informative_products = products_.map(product=>{
        const bitmask_of_product = BigInt(product.bitmask);
        const union = bitmask_of_product | user_choice_bitmask;
        const intersection = ~(bitmask_of_product ^ user_choice_bitmask);
        const ratio = union === 0n ? 1 : Number(countSetBits(intersection)) / Number(countSetBits(union));

        return [ratio, product]
    });

    informative_products.sort((a,b)=> a[0]-b[0]);
    const q1 = Math.floor(0.25 * informative_products.length);
    const q3 = Math.floor(0.75 * informative_products.length);

    let recommended_products = informative_products.slice(q1, q3); // Just don't extract the ratio from this in the frontend, or do

    res.status(200).json({
        success: true,
        recommended_products
    })
});

module.exports = {
    fetchRecomProds
}