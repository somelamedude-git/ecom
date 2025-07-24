const { addToWishList, removeFromWL, fetchWishList } = require('../APIs/wishlistAPI');
const express = require('express');
const { verifyJWT } = require('../middlewares/auth.middleware');
const router = express.Router;

router.get('/getItems', verifyJWT, fetchWishList);

module.exports = router;