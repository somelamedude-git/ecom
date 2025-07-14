const { Order } = require('../models/order.models');


function countSetBits(n)
{
    let count = 0;
    while (n > 0)
    {
        n &= (n - 1);
        count++;
    }
    return count;
}

async function initializeRecommendMask(user) {
  const peers = await Buyer.find({ ageBucket: user.ageBucket }).limit(10);
  let recommend_mask = 0n;

  for (const peer of peers) {
    const peerMask = peer.recommend_masking || '0';
    recommend_mask |= BigInt(peerMask);
  }

  if(recommend_mask === 0n){
    recommend_mask = 1n;
  }

  user.recommend_masking = recommend_mask.toString();
}

async function updateMask(user){
        let current_order = user.orderHistory[user.orderHistory.length-1];
        const orders = await Order.find({ _id: { $in: current_order } }).populate('product', 'bitmask');
        let mask = 0n;

        for(const order of orders){
            mask = mask|BigInt(order.product.bitmask || '0');
        }
    if(user.orderHistory.length === 1){ 
        user.prev_order_bit=mask.toString();
        user.recommend_masking = mask.toString();
    }
    else if(user.orderHistory.length>=2){
        const final_mask = BigInt(user.prev_order_bit || '0') & mask; 
        user.prev_order_bit = mask.toString();
        user.recommend_masking = final_mask.toString();
    }

  const same_age_buyers = await Buyer.find(
  { ageBucket: user.ageBucket },
  { recommend_masking: 1 }
);
  const buyers_bitmask = same_age_buyers_bitmask.map(mask => {
  const bitmask = BigInt(mask);
  const ratio = countSetBits(bitmask ^ BigInt(user.recommend_mask)) / countSetBits(bitmask | BigInt(user.recommend_mask));
  return [ratio, mask]; 
});

  buyers_bitmask.sort((a, b) => a[0] - b[0]);

  const quartile_one = 0.25*buyers_bitmask.length; const quartile_three = 0.75*buyers_bitmask.length;
  // Now between quartile one and three is where the golden ratio lies, thats where i pick my data from, this where randomness is introduced, but not too much

  let new_mask = 1n;
  for(let i = quartile_one; i<quartile_three; i++){
    new_mask = new_mask & BigInt(buyers_bitmask[i][1]);
  }

  user.recommend_masking = (BigInt(user.recommend_masking) | new_mask).toString();

}



module.exports = {
    initializeRecommendMask,
    updateMask
}

