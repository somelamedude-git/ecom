const express = require('express');
const router = express.Router();
const { verifyJWT } = require('../middlewares/auth.middleware');
const { addProduct, updateProductDetails } = require('../controllers/product.controller');

router.post('/addProduct', verifyJWT, addProduct);
router.post('/updateProduct', verifyJWT, updateProductDetails);

module.exports = router;