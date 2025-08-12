const express = require('express')
const router = express.Router()
const {webHook} = require('../middlewares/payment.middlewares')
const {updatePaymentStatus} = require('../APIs/payment')
const {razorpay} = require('../config/razorpay')

router.post('/webhook', (req, res, next) => {
    if (!razorpay) {
        return res.status(503).json({ error: "Payment service unavailable" });
    }
    webHook(req, res, (err) => {
        if (err) return next(err);
        updatePaymentStatus(req, res, next);
    });
});


module.exports = router