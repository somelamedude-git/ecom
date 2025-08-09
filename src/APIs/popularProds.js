const { asyncHandler } = require('../utils/asyncHandler');
const { ApiError } = require('../utils/ApiError');
const { Product } = require('../models/product.models');


const showProducts = asyncHandler(async(req,res)=>{
    let { limit = 10, page = 0, sortBy} = req.query;
    console.log('Entered');
    console.log(limit);
    console.log(page);
    limit = Number(limit) || 10;
    page = Number(page) || 0;

    console.log("modified")

    console.log(limit);
    console.log(page);

    const products = await Product.find().skip(limit*page).limit(limit);
    console.log(products);
    const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'popularity':
        return b.popularity - a.popularity;
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return calculateAverageRating(b.reviews) - calculateAverageRating(a.reviews);
      case 'views':
        return b.views - a.views;
      default:
        return 0;
    }
  });

  console.log("sorted prods");
  console.log(sortedProducts);
    const totalCount = await Product.countDocuments();
    const num_pages = Math.ceil(totalCount/limit);

    console.log(totalCount);
    console.log(num_pages);

    return res.status(200).json({
        success: true,
        sortedProducts,
        totalCount,
        num_pages,
        page,
        limit
    });
});
module.exports = {
    showProducts
}