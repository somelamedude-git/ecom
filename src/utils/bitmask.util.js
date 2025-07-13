function createBitMask(indexes = []){
    let mask = 0n;
    for(const index of indexes){
        mask |= (1n <<BigInt(index));
    }

    return mask.toString();
}

module.exports = {
    createBitMask
}

