const express = require('express');
const router = express.Router();
const { fetchPromo, addCode, applyPromo } = require('../APIs/promo.api');

router.get('/fetchCodes', fetchPromo);

module.exports = router;