const express = require('express');
const router = express.Router();
const { addressHandler } = require('../controllers/address.controller');
const {addressValidator } = require('../middlewares/address.validator');

router.post('/ChangeAddress', addressValidator, addressHandler);

module.exports = router;