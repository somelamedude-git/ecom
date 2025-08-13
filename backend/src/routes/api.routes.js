const express = require('express');
const { verifyEmail, verifyPassword } = require('../utils/verification.util');
const { fetchTagsAndCategories } = require('../APIs/fetchCT');
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
router.get('/forgot-password/:token', verifyPassword);
router.get('/fetchCT', fetchTagsAndCategories);

module.exports = router;
