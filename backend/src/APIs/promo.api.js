const { Promo } = require('../models/promo.model');
const { asyncHandler } = require('../utils/asyncHandler');
const { ApiError } = require('../utils/ApiError');
const { Buyer } = require('../models/user.models');

const applyPromo = asyncHandler(async(req, res)=>{
    const user_id = req.user._id;
    const { total_cost, code_used } = req.body;

    const user = await Buyer.findById(user_id.toString());
    if(!user) throw new ApiError(404, 'User not found');

    const promo_applied = await Promo.findOne({code:code_used});
    if(!promo_applied) throw new ApiError(400, 'Promo code not available');

    let user_list = promo_applied.used_by;

    const user_exists = user_list.find((id)=>id.toString() === user_id.toString());
    if(user_exists) throw new ApiError(400, 'You have already applied this promo code');


    const new_cost = total_cost - (total_cost * (promo_applied.discount_provided/100));
    promo_applied.used_by.push(user_id);
    await promo_applied.save();

    res.status(200).json({
        success: true,
        new_cost
    })
});

module.exports = {
    applyPromo
}