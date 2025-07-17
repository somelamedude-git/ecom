const { deleteUser, banUser } = require('../controllers/userControllers');
const express = require('express');
const { verifyJWT } = require('../middlewares/auth.middleware');
const router = express.Router();
router.post('/deleteUser', verifyJWT, deleteUser);
router.post('/banUser', verifyJWT, banUser);

module.exports = router;
