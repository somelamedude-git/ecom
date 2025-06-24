const { Product }  = require("../models/product.models");
const { asyncHandler } = require("../utils/asyncHandler");
const { Seller } = require("../models/user.models");
const { ApiError } = require("../utils/ApiError");
const { uploadOnCloudinary } = require("../utils/cloudinary");

const addProduct = asyncHandler(async(req, res)=>{
    const userId = req.user._id;
    const user_ = await Seller.findById(userId);

    if(!user_){
        throw new ApiError(404, "Seller not found");
    }
    const { description, name, price, stock, status, category } = req.body;
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
        status,
        category,
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
    const {productId, ...updateFields} = req.body;
    const user = await Seller.findById(userId);

    if(!user){
        throw new ApiError(404, "Seller Not Found");
    }

    const ownsProduct = user.selling_products.some(p => p.product.toString() === productId);
    if(!ownsProduct) throw new ApiError(404, "You don't own this product");

    const product = await Product.findById(productId);

    for(const key in updateFields){
        if(req.body[key] !== undefined){
            product[key] = updateFields[key];
        }
    }

    await product.save();

    res.status(201).send({
        success:true,
        message: "Product Information updated successfully",
        data:{
            _id:product._id,
            name:product.name
        }
    });
})

module.exports = {
    addProduct,
    updateProductDetails
}