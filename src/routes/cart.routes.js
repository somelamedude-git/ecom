const express = require('express');
const router = express.Router();
const { verifyJWT } = require('../middlewares/auth.middleware');
const { fetchCart } = require('../APIs/fetchCart');
const { filterOutItems } = require('../middlewares/fetchCart.middleware');
const { incrementItem, decrementItem } = require('../APIs/addToCart');
const { changeQuantUtil } = require('../utils/cartUtility');

router.get('/getItems', verifyJWT, filterOutItems, fetchCart);
router.patch('/increment/:product_id', verifyJWT, changeQuantUtil, incrementItem);
router.patch('/decrement/:product_id', verifyJWT, changeQuantUtil, decrementItem);

module.exports = router;