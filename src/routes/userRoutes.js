const express = require('express')
const router = express.Router()

router.post('/register', userController.createUser)
router.post('/login', userController.getUser)
router.patch('/update/:id', userController.updateUser)
router.delete('/delete_account/:id', userController.deleteUser)
router.get('/verify-email/:id', userController.verifyUser)

module.exports = router