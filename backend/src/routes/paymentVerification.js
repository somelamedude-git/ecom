const express = require('express')
const router = express.Router()
const {webHook} = require('../middlewares/payment.middlewares')
const {updatePaymentStatus} = require('../APIs/payment')

router.post('/webhook', webHook, updatePaymentStatus)

module.exports = router