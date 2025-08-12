const { Promo } = require('../models/promo.model');
const { asyncHandler } = require('../utils/asyncHandler');
const { ApiError } = require('../utils/ApiError');
const { Buyer, Admin } = require('../models/user.models');

const applyPromo = asyncHandler(async(req, res)=>{
    const user_id = req.user._id;
    let { total_cost, code_used } = req.body;
    total_cost = Number(total_cost);
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

const addCode = asyncHandler(async(req, res)=>{
    const user_id = req.user._id;
    const admin = Admin.findById(user_id.toString());
    if(!admin) throw new ApiError(400, 'Unauthorized access');

    let { code, discount } = req.body;
    discount = Number(discount);
    const new_code = await Promo.create({
        code: code,
        discount_provided:discount,
        used_by: []
    });

    await new_code.save();

    res.status(200).json({
        success: true,
        message: 'Promo code added successfully'
    })
})

module.exports = {
    applyPromo,
    addCode
}