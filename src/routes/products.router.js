const express = require('express');
const router = express.Router();
const { verifyJWT } = require('../middlewares/auth.middleware');
const { addProduct, updateProductDetails } = require('../controllers/product.controller');
const { fetchReviews, addReview }  = require('../APIs/review.api');

router.post('/addProduct', verifyJWT, addProduct); // multer lagao
router.post('/updateProduct', verifyJWT, updateProductDetails);
router.get('/getReviews/:product_id', fetchReviews);
router.post('/:product_id//addReview', verifyJWT, addReview);

module.exports = router;