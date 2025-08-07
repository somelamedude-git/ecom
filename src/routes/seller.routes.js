const express = require('express');
const router = express.Router();
const { fetchSalesMap } = require('../APIs/heatmap.api');
const { verifyJWT } = require('../middlewares/auth.middleware');
const { fetchSellerProducts } = require('../APIs/products.api');
const { productAnalysis } = require('../APIs/products.api');
const { sellerStats } = require('../APIs/sellerStats');
const { fetchSellerOrders } = require('../APIs/sellerOrders');
const { updateStatus } = require('../APIs/sellerOrders');
const { addProduct } = require('../controllers/product.controller');
const { uploadSingle } = require('../middlewares/multer');

router.get('/SalesMap', verifyJWT, fetchSalesMap);
router.get('/productList', verifyJWT, fetchSellerProducts);
router.get('/:product_id/analytics', verifyJWT, productAnalysis);
router.get('/stats', verifyJWT, sellerStats);
router.get('/orders', verifyJWT, fetchSellerOrders);
router.patch('/orders/:orderId/status', verifyJWT, updateStatus);
router.post('/addProduct', verifyJWT, uploadSingle, addProduct);

module.exports = router;