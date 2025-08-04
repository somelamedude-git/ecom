const { Product } = require('../models/product.models');
const { Buyer } = require('../models/user.models');
const { asyncHandler } = require('../utils/asyncHandler');
const { ApiError } = require('../utils/ApiError');
const { Tag } = require('../models/tags.model');
const { initializeRecommendMask } = require('./defaultRecom');

const fetchRecomProds = asyncHandler(async(req, res)=>{
    const user_id = req.user._id;
    const user = await Buyer.findById(user_id.toString());

    if(!user){
        console.log('User not found');
        throw new ApiError(404, 'User not found');
    }
    await initializeRecommendMask(user);
    const user_mask = user.recommend_masking;
    const length_mask = user_mask.length;

    let tags_array = [];

for(let i = 0; i<length_mask; i++){
    
}

});

module.exports = {
    fetchRecomProds
}