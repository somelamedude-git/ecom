const express = require('express')
const router = express.Router()
const {refund, payment_db_save} = require('../APIs/payment')
const { verifyJWT } = require('../middlewares/auth.middleware')

router.post('/refund', verifyJWT, refund)
router.post('/pay', verifyJWT, payment_db_save)

module.exports = router