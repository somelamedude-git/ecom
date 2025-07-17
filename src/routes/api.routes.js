const express = require('express');
const { verifyEmail } = require('../utils/verification.util');
const router = express.Router();

router.get('/auth/verifyEmail/:token', verifyEmail);

module.exports = router;