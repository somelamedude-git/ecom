const Razorpay = require('razorpay');
require('dotenv').config({ path: '../.env' });

let razorpay = null;

if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
} else {
  console.warn("⚠ Razorpay keys missing — payment routes will be disabled.");
}

module.exports = {razorpay};



// const razorpay = new Razorpay({
//     key_id:process.env.razor_key,
//     key_secret:process.env.razor_secret
// })

// module.exports = {razorpay}
