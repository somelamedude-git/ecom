const { addToWishList, removeFromWL, fetchWishList } = require('../APIs/wishlistAPI');
const express = require('express');
const { verifyJWT } = require('../middlewares/auth.middleware');
const router = express.Router();

router.get('/getItems', verifyJWT, fetchWishList);
router.delete('/deleteItem/:product_id', verifyJWT, removeFromWL);
router.post('/add/:product_id', verifyJWT, addToWishList);

module.exports = router;