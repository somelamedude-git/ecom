const express = require('express');
const router = express.Router();
const { verifyJWT } = require('../middlewares/auth.middleware');
const { 
    addOrder, 
    addOrderFromCart, 
    cancelOrder, 
    schedule_return, 
    approve_return, 
    returned, 
    reached_return, 
    shipped, 
    orderConfirmed 
} = require('../controllers/orderControllers');
const { fetchStatus } = require('../APIs/fetchStatus');
const { fetchOrderDetails } = require('../APIs/fetchOrderDetails');

router.post('/add', verifyJWT, addOrder);
router.post('/cart', verifyJWT, addOrderFromCart);

router.post('/confirm', verifyJWT, orderConfirmed);
router.patch('/cancel', verifyJWT, cancelOrder);
router.patch('/ship', verifyJWT, shipped);

router.patch('/schedule-return', verifyJWT, schedule_return);
router.patch('/approve-return', verifyJWT, approve_return);
router.patch('/returned', verifyJWT, returned);
router.patch('/reached-return', verifyJWT, reached_return);

router.post('/status', verifyJWT, fetchStatus);
router.get('/details/:orderId', verifyJWT, fetchOrderDetails);

module.exports = router;