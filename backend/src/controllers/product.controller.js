const { Product }  = require("../models/product.models");
const { asyncHandler } = require("../utils/asyncHandler");
const { Seller } = require("../models/user.models");
const { ApiError } = require("../utils/ApiError");
const { uploadOnCloudinary } = require("../utils/cloudinary");
const { Tag } = require('../models/tags.model');
const { Category } = require('../models/category.models');
const mongoose = require('mongoose');

const addProduct = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { description, name, price, status, category } = req.body;
    console.log('In add product', req.body);
    const stock = JSON.parse(req.body.stock);

   
    const categoryDoc = await Category.findOne({ name: category });
    console.log('In categorypROD')
    if (!categoryDoc) throw new ApiError(404, "Category document not found");

   
    let tagNames = req.body.tagNames || [];
    if (typeof tagNames === "string") {
      try {
        tagNames = JSON.parse(tagNames);
      } catch (e) {
        throw new ApiError(400, "Invalid tag format");
      }
    }

    const tags = await Tag.find({ name: { $in: tagNames } });
    if (tags.length !== tagNames.length) {
      throw new ApiError(400, "Some tags are invalid");
    }

    const tagIndexes = tags.map((tag) => tag.index);

    let bitmask = 0;
    for (const index of tagIndexes) {
      bitmask |= 1 << index;
    }

    if (!req.file) {
      throw new ApiError(400, "No images provided");
    }
    const localPath = req.file.path;
    console.log("local path", localPath);

    const imageInfo = await uploadOnCloudinary(localPath);
    console.log(imageInfo, "testing the cloud");
    
    if (!imageInfo || !imageInfo.secure_url) {
      throw new ApiError(500, "Image Upload Failed");
    }
    const image_url = imageInfo.secure_url;

    const newProduct = await Product.create({
      description,
      name,
      productImages: image_url,
      price,
      stock,
      status,
      category: categoryDoc._id,
      tags: tagIndexes,
      owner: userId,
      bitmask: bitmask.toString(),
    });

    await Seller.findByIdAndUpdate(userId, {
      $push: { selling_products: newProduct._id },
    });


    categoryDoc.products.push(newProduct._id);
    await categoryDoc.save();

    res.status(201).send({
      success: true,
      message: "Product created successfully",
      data: {
        _id: newProduct._id,
        name: newProduct.name,
        stock: newProduct.stock,
      },
    });
  } catch (error) {
    throw new ApiError(500, `Failed to create product: ${error.message}`);
  }
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
});

const removeProduct = asyncHandler(async(req, res)=>{
  const userId = req.user._id;
  const {remove_product_id} = req.params;
  console.log('id is present');
  console.log(remove_product_id)

  let user = await Seller.findById(userId.toString()).select("selling_products");
  console.log(user);
  if(!user) throw new ApiError(404, 'User not found');
  console.log(user.selling_products)

  user.selling_products = user.selling_products.filter(product_id => 
    (product_id._id.toString() !== remove_product_id.toString()) || // A quirky product we have, don't mind this line
    
    (product_id.toString() !== remove_product_id.toString()));
  console.log(user.selling_products);
  await user.save();

  const deletedProduct = await Product.findByIdAndDelete(remove_product_id.toString());
  console.log(deletedProduct);
  if(!deletedProduct){
    throw new ApiError(404, 'Product not found');
  }

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully'
  })
});


module.exports = {
    addProduct,
    updateProductDetails,
    removeProduct
}