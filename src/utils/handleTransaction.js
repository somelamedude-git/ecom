const mongoose = require('mongoose');

const handleTransaction = async(fn)=>{
    const session = await mongoose.startSession();
    session.startTransaction();

    try{
        const result = await fn(session);
        await session.commitTransaction();
        session.endSession();
        return result;

    } catch(error){
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
}

module.exports = {
    handleTransaction
}