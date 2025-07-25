const express = require('express')
const router = express.Router()
const {webhook} = require('../middlewares/payment.middlewares')
const {updatePaymentStatus} = require('../APIs/payment')

router.post('/webhook', webhook, updatePaymentStatus)

module.exports = router