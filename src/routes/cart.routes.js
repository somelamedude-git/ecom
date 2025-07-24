const express = require('express');
const router = express.Router();
const { verifyJWT } = require('../middlewares/auth.middleware');
const { fetchCart } = require('../APIs/fetchCart');
const { filterOutItems } = require('../middlewares/fetchCart.middleware');
const { incrementItem, decrementItem, deleteItem, addToBag} = require('../APIs/addToCart');
const { changeQuantUtil } = require('../utils/cartUtility');

router.get('/getItems', verifyJWT, filterOutItems, fetchCart);
router.patch('/increment/:product_id', verifyJWT, changeQuantUtil, incrementItem);
router.patch('/decrement/:product_id', verifyJWT, changeQuantUtil, decrementItem);
router.delete('/deleteItem/:product_id', verifyJWT, deleteItem);
router.post('/addItem/:product_id', verifyJWT, addToBag);

module.exports = router;