const express = require('express')
const router = express.Router()
const {refund, payment_db_save} = require('../APIs/payment')
const { verifyJWT } = require('../middlewares/auth.middleware')

const {razorpay} = require('../config/razorpay')

router.post('/refund', verifyJWT,(req, res, next) => {
    if (!razorpay) {
        return res.status(503).json({ error: "Payment service unavailable" });
    }
    next();
}, refund)
router.post('/pay', verifyJWT,(req, res, next) => {
    if (!razorpay) {
        return res.status(503).json({ error: "Payment service unavailable" });
    }
    next();
}, payment_db_save)

module.exports = router