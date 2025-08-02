const { Product } = require('../models/product.models');
const { asyncHandler } = require('../utils/asyncHandler');
const { ApiError } = require('../utils/ApiError');
const natural = require('natural');

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
    searchProduct
}