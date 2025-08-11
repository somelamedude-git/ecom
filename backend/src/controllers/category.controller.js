const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");
const { Category } = require("../models/category.models");
const { Product } = require("../models/product.models");

//We will be needing the product id for this

const categoryController = asyncHandler(async (req, res)=>{
    let product_id = req.product._id;
    const product_category = await Product.findById(product_id).populate("Category");
    if(!product_category){
        product_category = req.Category;
    }
    try{
        await product_category.save();
        res.status(200).json({
            success:true,
            message: "Category of the product successfully saved"
        })
    }
    catch(error){
        throw new ApiError(500, "Failed to add category", error?.message || []);    
    }
})

module.exports = {categoryController};