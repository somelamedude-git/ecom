const express = require('express');
const router = express.Router();
const { createUser, getUser, updateUser, deleteUser, verifyUser } = require('../controllers/userControllers')

router.post('/register', createUser)
router.post('/login', getUser)
router.patch('/update/:id', updateUser)
router.delete('/delete_account/:id', deleteUser)
router.get('/verify-email/:id', verifyUser)

module.exports = router