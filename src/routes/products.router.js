const express = require('express');
const router = express.Router();
const { verifyJWT } = require('../middlewares/auth.middleware');
const { addProduct, updateProductDetails } = require('../controllers/product.controller');
const { addToBag } = require('../APIs/addToCart');

router.post('/addProduct', verifyJWT, addProduct);
router.post('/updateProduct', verifyJWT, updateProductDetails);
router.post('/addToCart/:product_id', verifyJWT, addToBag);
module.exports = router;