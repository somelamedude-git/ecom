const express = require('express')
const router = express.Router()
const {getOrders} = require('../APIs/fetchOrders')
const { verifyJWT } = require('../middlewares/auth.middleware')

router.get('/orders', verifyJWT, getOrders)

module.exports = router