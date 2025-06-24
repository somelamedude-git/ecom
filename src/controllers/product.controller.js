const { Product }  = require("../models/product.models");
const { asyncHandler } = require("../utils/asyncHandler");
const { Seller } = require("../models/user.models");
const { ApiError } = require("../utils/ApiError");
const {checkProductSimilarity} = require("../utils/product.utils");
const { uploadOnCloudinary } = require("../utils/cloudinary");

const addProduct = asyncHandler(async(req, res)=>{
    const userId = req.user._id;
    const user_ = await Seller.findById(userId);

    if(!user_){
        throw new ApiError(401, "User not found");
    }
    const { description, name, price, stock, category } = req.body;
    const productImages = [];

    for(const file of req.files){
        const localPath = file.path;
        const image_url = await uploadOnCloudinary(localPath);

        if(!image_url) throw new ApiError(500, "Image Upload Failed");
        productImages.push(image_url);
    }

    const newProduct = await Product.create({
        description,
        name,
        productImages:productImages,
        price,
        stock,
        category,
        reviews : [],
        owner: user_._id
    });

    user_.selling_products.push(newProduct);
    await user_.save();

    res.status(201).send({
        success:true,
        message: "Product created successfully"
    });
});

module.exports = {
    addProduct
}