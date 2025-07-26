const express = require('express');
const router = express.Router();
const { productAnalysis } = require('../APIs/products.api');
const {verifyJWT} = require('../middlewares/auth.middleware');

router.get('/:product_id/analytics', verifyJWT, productAnalysis);

module.exports = router;
