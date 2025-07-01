const express = require('express');
const router = express.Router();
const { fetchProducts } = require('../APIs/productDisplay')

router.get('/', fetchProducts);

module.exports = router;