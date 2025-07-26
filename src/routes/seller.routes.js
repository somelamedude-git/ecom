const express = require('express');
const router = express.Router();
const { fetchSalesMap } = require('../APIs/heatmap.api');
const { verifyJWT } = require('../middlewares/auth.middleware');

router.get('/SalesMap', verifyJWT, fetchSalesMap);

module.exports = router;