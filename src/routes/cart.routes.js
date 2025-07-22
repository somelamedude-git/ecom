const express = require('express');
const router = express.Router();
const { verifyJWT } = require('../middlewares/auth.middleware');
const { fetchCart } = require('../APIs/fetchCart');
const { filterOutItems } = require('../middlewares/fetchCart.middleware');
const { incrementItem, decrementItem } = require('../APIs/addToCart');
const { changeQuantUtil } = require('../utils/cartUtility');

router.get('/view', verifyJWT, filterOutItems, fetchCart);
router.patch('/increment/:product_id', verifyJWT, changeQuantUtil, incrementItem);

module.exports = router;