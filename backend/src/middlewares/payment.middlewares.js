const {asyncHandler} = require('../utils/asyncHandler')
const crypto = require('crypto')

const webHook = asyncHandler(async (req, res, next) => {
  const secret = process.env.razor_secret;
  
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(req.rawBody)
    .digest('hex');

  const razorSignature = req.headers['x-razorpay-signature'];

  if (expectedSignature === razorSignature) {
    next();
  } else {
    return res.status(400).json({ success: false, message: 'Invalid signature' });
  }
});

module.exports = {
    webHook
}