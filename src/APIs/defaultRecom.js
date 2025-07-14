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

async function updateMask(user){ //This happens everytime a user adds an order, kinda like sliding window
    
}

module.exports = {
    initializeRecommendMask
}

