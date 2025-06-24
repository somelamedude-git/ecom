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
        throw new ApiError(404, "Seller not found");
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
        message: "Product created successfully",
        data:{
            _id:newProduct._id,
            name: newProduct.name,
            stock: newProduct.stock
        }
    });
});

const updateProductDetails  = asyncHandler(async(req, res)=>{
    const userId = req.user._id;
    const user = await Seller.findById(userId);

    if(!user){
        throw new ApiError(404, "Seller Not Found");
    }

    for(const key in req.body){
        if(req.body[key] !== undefined){
            user.Product[key] = req.body[key];
        }
    }

    await user.save();

    res.status(201).send({
        success:true,
        message: "Product Information updated successfully"
    });
})

module.exports = {
    addProduct,
    updateProductDetails
}