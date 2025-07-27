const { deleteUser, banUser } = require('../controllers/userControllers');
const express = require('express');
const { verifyJWT, adminCheck } = require('../middlewares/auth.middleware');
const {fetchUsers} = require('../APIs/fetchUsers')
const router = express.Router();
router.post('/deleteUser', verifyJWT, adminCheck, deleteUser);
router.post('/banUser', verifyJWT, adminCheck, banUser);
router.get('/listusers', verifyJWT, adminCheck, fetchUsers)

module.exports = router;
