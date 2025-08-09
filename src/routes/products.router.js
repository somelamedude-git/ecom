const express = require('express');
const router = express.Router();
const { verifyJWT } = require('../middlewares/auth.middleware');
const { addProduct, updateProductDetails } = require('../controllers/product.controller');
const { fetchReviews, addReview }  = require('../APIs/review.api');
const { showProducts } = require('../APIs/popularProds');
const { fetchSingleProduct } = require('../APIs/products.api');

router.post('/addProduct', verifyJWT, addProduct); // multer lagao
router.post('/updateProduct', verifyJWT, updateProductDetails);
router.get('/getReviews/:product_id', fetchReviews);
router.post('/:product_id//addReview', verifyJWT, addReview);
router.get('/fetchProducts', showProducts);
router.get('/details/:product_id', fetchSingleProduct);

module.exports = router;