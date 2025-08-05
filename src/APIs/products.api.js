const { Product } = require('../models/product.models');
const { asyncHandler } = require('../utils/asyncHandler');
const { ApiError } = require('../utils/ApiError');
const { Seller } = require('../models/user.models')

const fetchSingleProduct = asyncHandler(async(req, res)=>{
    const { product_id } = req.params;
    const product = await Product.findByIdAndUpdate(product_id.toString(),
        { $inc: {views: 1}}, { new: true }
    ).select("description name views productImages price stock").lean();

    if(!product){
        throw new ApiError(404, 'Product not found');
    }

    const sizes_available = Object.keys(product.stock || {});// Map this and arrange it in the frontend as the buttons, and re-render the well stock
    // The whole map of stocks will be exported btw

    return res.status(200).json({
        success: true,
        product_info: product,
        product_sizes: sizes_available
    });
});

const fetchSellerProducts = asyncHandler(async(req, res)=>{
    const user_id = req.user._id;
    const user = await Seller.findById(user_id.toString()).select("selling_products").populate("selling_products.product").lean(); // We are only reading, no need for shmancy mongoose <3
    let { page = 1, limit=10, sortBy="newest", search=""} = req.query;
    console.log(req.query);
    search = (search || "").toString().toLowerCase();
    sortBy = (sortBy || "").toString().toLowerCase();
     const pageNum = Number(page);
    const limitNum = Number(limit);
    if(!user) throw new ApiError(404, 'User not found');
    const numberOfProducts = user.selling_products.length;
    const numberOfPages = Math.ceil(numberOfProducts/limitNum);
    let productsOfUser = user.selling_products.map((item)=>item.product);
    if(search!==""){
      productsOfUser = productsOfUser.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase())
      )
    }
    if(sortBy==="newest"){
      productsOfUser = productsOfUser.sort((a,b)=>new Date(b.createdAt) - new Date(a.createdAt));
    }
    else if(sortBy ==="oldest"){
      productsOfUser = productsOfUser.sort((a,b)=> new Date(a.createdAt)- new Date(b.createdAt));
    }

    else if(sortBy==="price-high"){
      productsOfUser = productsOfUser.sort((a,b)=> b.price-a.price);
    }

    else if(sortBy==="price-low"){
      productsOfUser = productsOfUser.sort((a,b)=> a.price-b.price);
    }

    else if(sortBy === "popular"){
      productsOfUser = productsOfUser.sort((a,b)=> b.popularity-a.popularity);
    }

    else if(sortBy == "views"){
      productsOfUser = productsOfUser.sort((a,b)=> b.views-a.views);
    }


    // As the products here are in an array, i will do this:
    const start = (pageNum-1)*limitNum;
    const end = start + limitNum;

    productsOfUser = productsOfUser.slice(start, end);

    return res.status(200).json({
        success: true,
        productsOfUser,
        numberOfPages
    });
});

const productAnalysis = asyncHandler(async(req, res)=>{
    const user_id = req.user._id;
    const user = await Seller.findById(user_id.toString()).select("_id");
    if(!user) throw new ApiError(404, 'User not found');
    const { product_id } = req.params;

    const product = await Product.findById(product_id.toString()).select("owner views times_ordered added_to_cart average_age_customers times_returned name price").lean();
    if(product.owner.toString() !=user_id.toString()){
        throw new ApiError(401, 'Unauthorized Access');
    }

    let analytics = {};
    analytics.views = product.views || 0;
    analytics.times_ordered = product.times_ordered || 0;
    analytics.added_to_cart = product.added_to_cart || 0;
    analytics.average_age_customers = product.average_age_customers || 0;
    analytics.times_returned = product.times_returned || 0;

    if (
  typeof product.times_ordered === "number" &&
  typeof product.added_to_cart === "number" &&
  product.added_to_cart !== 0
) {
  analytics.order_ratio = product.times_ordered / product.added_to_cart;
} else {
  analytics.order_ratio = 0;
}

if (
  typeof product.times_ordered === "number" &&
  typeof product.times_returned === "number" &&
  product.times_ordered !== 0
) {
  analytics.return_ratio = product.times_returned/ product.times_ordered;
} else {
  analytics.return_ratio = 0; 
}

if (
  typeof product.views === "number" &&
  typeof product.added_to_cart === "number" &&
  product.views !== 0
) {
  analytics.cart_ratio = product.added_to_cart / product.views;
} else {
  analytics.cart_ratio = 0; 
}
return res.status(200).json({
    success:true,
    analytics,
    info:{
        name:product.name,
        price: product.price
    }
})
})


module.exports = {
    fetchSingleProduct,
    fetchSellerProducts,
    productAnalysis
}