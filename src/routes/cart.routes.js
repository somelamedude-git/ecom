const express = require('express');
const router = express.Router();
const { verifyJWT } = require('../middlewares/auth.middleware');
const { fetchCart } = require('../APIs/fetchCart');
const { filterOutItems } = require('../middlewares/fetchCart.middleware');

router.get('/view', verifyJWT, filterOutItems, fetchCart);

module.exports = router;