const express = require('express');
const { verifyEmail } = require('../utils/verification.util');
// const {getStats} = require('../utils/analytics')
const router = express.Router();

router.get('/auth/verifyEmail/:token', verifyEmail);

//router.get('/analytics/stats', async (req, res) => {
  //  try {
    //    const stats = await getStats()
      //  res.status(200).json({status: true, stats})
//    } catch (err) {
  //      console.error(err)
    //    res.status(500).json({status: false, message: "Internal server error"})
   // }
//})

module.exports = router;
