const express = require('express');
const router = express.Router();
const { verifyJWT } = require('../middlewares/auth.middleware');
const { fetchChart } = require('../APIs/fetchCart');

router.get('/view', verifyJWT, fetchChart);

module.exports = router;