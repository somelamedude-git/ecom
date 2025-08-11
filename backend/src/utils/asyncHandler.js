const asyncHandler = (func)=> async (req, res, next)=> {
    try{
        await func(req, res, next);
    } catch(error){
        next(error);
    }
}

async function asyncWrapper(fn) {
  try {
    return await fn();
  } catch (error) {
    return { error };
  }
}

module.exports = { asyncHandler, asyncWrapper };