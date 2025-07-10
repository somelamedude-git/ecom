const express = require('express');
const router = express.Router();
const { addressHandler } = require('../controllers/address.controller');
const {addressValidator } = require('../middlewares/address.validator');
const { verifyJWT } = require('../middlewares/auth.middleware')

router.post('/ChangeAddress', verifyJWT, addressValidator, addressHandler);

module.exports = router;