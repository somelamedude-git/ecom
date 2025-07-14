const { Order } = require('../models/order.models');

async function initializeRecommendMask(user) {
  const peers = await Buyer.find({ ageBucket: user.ageBucket }).limit(10); //This size decreases as the database gets heavier, will figure out a function for this
  let recommend_mask = 0n;

  for (const peer of peers) {
    const peerMask = peer.recommend_masking || '0';
    recommend_mask |= BigInt(peerMask);
  }

  if(recommend_mask === 0n){
    // Here we send the most popular products, not by age group but overall, so yaha pe 1n can be there, have to give it some value for well, default
    recommend_mask = 1n;
  }

  user.recommend_masking = recommend_mask.toString();
}

//The logic to this will be explained in the documentation

async function updateMask(user){ //This happens everytime a user adds an order, kinda like sliding window, peer to peer i can create
    // Most likely, for users who just began, unka 1n hoga bitmask, so now we find common shit in ordersm and delete some tags
    //We don't want faaltu ka overhead and tags, orderhistory is also needed, we flip the bits in the last one and then proceed with the next one
    //Depending on the window size
    let current_order;

    if(user.orderHistory.length === 1){ // We turn te mask to 0 again, we need or conditions not and, optimal
        // Now we dive into well, the array of arrays
        current_order = user.orderHistory[user.orderHistory.length-1];
        const orders = await Order.find({ _id: { $in: current_order } }).populate('product', 'bitmask');
        let mask = 0n;
        for(const order of orders){
            mask = mask|BigInt(order.product.bitmask || '0');
        }
        user.recommend_masking = mask.toString();
    }
}

module.exports = {
    initializeRecommendMask,
    updateMask
}

