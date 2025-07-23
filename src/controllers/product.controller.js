const { Product }  = require("../models/product.models");
const { asyncHandler } = require("../utils/asyncHandler");
const { Seller } = require("../models/user.models");
const { ApiError } = require("../utils/ApiError");
const { uploadOnCloudinary } = require("../utils/cloudinary");
const { Tag } = require('../models/tags.model');

const addProduct = asyncHandler(async(req, res)=>{ 
    const userId = req.user._id;
    const user_ = await Seller.findById(userId);

    if(!user_){
        throw new ApiError(404, "Seller not found");
    }
    const { description, name, price, stock, status, category } = req.body;
    let tagNames = req.body.tagNames || [];
    const Tags = await Tag.find({name:{$in: tagNames}});
    if(Tags.length != tagNames.length){
        throw new ApiError(400, 'Some tags are invalid');
    }
    const tagIndexes = Tags.map(tag=>tag.index);

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
        tags:tagIndexes,
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

    const product = await Product.findById(productId);
    if(!product) throw new ApiError(404, 'Product not found');
    const user = await Seller.findById(userId);

    if(!user){
        throw new ApiError(404, "Seller Not Found");
    }
    
    
    const ownsProduct = user._id.equals(product.owner)
    if(!ownsProduct) throw new ApiError(404, "You don't own this product");


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