const express = require('express')

const router = express.Router()
const {sendMail} = require('../APIs/sendMail')

router.post('/mail', sendMail)

module.exports = router