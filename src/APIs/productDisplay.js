const { Product } = require('../models/product.models');
const { asyncHandler } = require('../utils/asyncHandler');
const { ApiError } = require('../utils/ApiError');
const natural = require('natural');

const fetchProducts = asyncHandler(async(req, res)=>{
    if(req.params.productId){ //Only for singular produt fetch when the user clicks on an item, this won't be a query, its params
        const product = await Product.findById(req.params.productId);
        if(!product) throw new ApiError(404, 'The product you requested for does not exist');
        return res.status(200).send({success:true, data:{ product }});
    }
    const limit = 20;

    const number_of_products = await Product.countDocuments();
    const number_of_pages = Math.ceil(number_of_products/limit); //We limit the products to 20 per page for now

    const page = Math.min((Number(req.query.page) || 1), number_of_pages); //No error in this way, if someone clicks 40 when we have 10 pages, they go to the 10th page :)
    
    //Now we fetch the data with limit and skip kyunki (n-1)*limit jayega format
    
    const products = await Product.find().limit(limit).skip((page-1)*limit).sort({ createdAt: -1 });
    if(products.length===0) throw new ApiError(404, "Products not found");
    res.status(200).json({ products });
});

//Use this for dashboard, wishlist and cart

const searchProduct = asyncHandler(async(req,res)=>{
    const rawQuery = req.query.q?.toLowerCase();
    if(!rawQuery){
      throw new ApiError(400, "Search query is required");
    }
    const query_tokenized = rawQuery.split(" ");
    const allTags = await Product.distinct('tags');
    const similarTags = allTags.filter((tag)=>{
        const tagLower = tag.toLowerCase();

        return query_tokenized.some(word=>{
            const dist = natural.DamerauLevenshteinDistance(word, tagLower);
            return dist<=2;
        });
    });
    const limit =20;
    const length = await Product.countDocuments({
        tags: {$in: similarTags}
    });

   if (similarTags.length === 0) {
  return res.status(200).json({
    success: true,
    products: [],
    suggestion: "No similar tags found. Try a different keyword?"
  });
}

    const number_of_pages = Math.ceil(length/limit);
    const page = Math.min((Number(req.query.page) || 1), number_of_pages); 
    const products = await Product.find({
        tags: {$in: similarTags}
    }).limit(limit).skip((page-1)*limit).sort({createdAt: -1});

    return res.status(200).json({
  success: true,
  currentPage: page,
  totalPages: number_of_pages,
  totalProducts: length,
  products
});

})

module.exports = {
    fetchProducts,
    searchProduct
}