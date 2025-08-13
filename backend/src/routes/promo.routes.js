const express = require('express');
const router = express.Router();
const { fetchPromo, addCode, applyPromo } = require('../APIs/promo.api');
const { verifyJWT } = require('../middlewares/auth.middleware');

router.get('/fetchCodes', fetchPromo);
router.patch('/apply', verifyJWT, applyPromo);

module.exports = router;