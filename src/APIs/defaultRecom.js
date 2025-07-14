async function initializeRecommendMask(user) {
  const peers = await Buyer.find({ ageBucket: user.ageBucket }).limit(3);
  let recommend_mask = 0n;

  for (const peer of peers) {
    const peerMask = peer.recommend_masking || '0';
    recommend_mask |= BigInt(peerMask);
  }

  user.recommend_masking = recommend_mask.toString();
}

module.exports = {
    initializeRecommendMask
}