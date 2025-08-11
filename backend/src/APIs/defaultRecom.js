const { Order } = require('../models/order.models');
const { Buyer } = require('../models/user.models');

function countSetBits(n) {
  let count = 0n;
  while (n > 0n) {
    n &= (n - 1n);
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

  if (recommend_mask === 0n) {
    recommend_mask = 1n; 
  }

  user.recommend_masking = recommend_mask.toString();
}


async function updateMask(user) {
  if (!user.orderHistory || user.orderHistory.length === 0) return;

  const current_order = user.orderHistory[user.orderHistory.length - 1];
  if (!Array.isArray(current_order)) return;

  const orders = await Order.find({ _id: { $in: current_order } }).populate('product', 'bitmask');
  let current_mask = 0n;

  for (const order of orders) {
    current_mask |= BigInt(order.product?.bitmask || '0');
  }

  if (user.orderHistory.length === 1) {
    user.prev_order_bit = current_mask.toString();
    user.recommend_masking = current_mask.toString();
  } else {
    const previous_mask = BigInt(user.prev_order_bit || '0');
    const final_mask = previous_mask & current_mask;
    user.prev_order_bit = current_mask.toString();
    user.recommend_masking = final_mask.toString();
  }

  const same_age_buyers = await Buyer.find(
    { ageBucket: user.ageBucket },
    { recommend_masking: 1 }
  );

  const buyers_bitmask = same_age_buyers
    .map(peer => {
      const bitmask = BigInt(peer.recommend_masking || '0');
      const union = bitmask | BigInt(user.recommend_masking);
      const intersection = ~(bitmask ^ BigInt(user.recommend_masking));
      const ratio = union === 0n ? 1 : Number(countSetBits(intersection)) / Number(countSetBits(union));
      return [ratio, bitmask];
    });

  buyers_bitmask.sort((a, b) => a[0] - b[0]);

  const q1 = Math.floor(0.25 * buyers_bitmask.length);
  const q3 = Math.floor(0.75 * buyers_bitmask.length);

  let new_mask = 1n;
  for (let i = q1; i < q3; i++) {
    new_mask &= buyers_bitmask[i][1];
  }

  user.recommend_masking = (BigInt(user.recommend_masking || '0') | new_mask).toString();
}

module.exports = {
  initializeRecommendMask,
  updateMask,
  countSetBits
};
