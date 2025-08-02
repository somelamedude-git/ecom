const { asyncHandler } = require('../utils/asyncHandler');
const { ApiError } = require('../utils/ApiError');
const { Product } = require('../models/product.models');


const showProducts = asyncHandler(async(req,res)=>{
    let { limit = 10, page = 0} = req.query;
    limit = Number(limit);
    page = Number(page);

    const products = await Product.find().skip(limit*page).limit(limit);
    const totalCount = await Product.countDocuments();

    const num_pages = Math.ceil(totalCount/limit);

    return res.status(200).json({
        success: true,
        products,
        totalCount,
        num_pages,
        page,
        limit
    })
})
module.exports = {
    showProducts
}