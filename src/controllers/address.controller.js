const { getOrUpdateUserAddress } = require("../services/address.service");
const { asyncHandler } = require("../utils/asyncHandler");

//This will lead to the frontend page when the user has to add their address during ordering, and autofill has to be handled as well
//SO obviously, ID of the user is needed
//For that, we will be intercepting it by a middleware, which adds ID to the controller

//Now there will be two options, one of updating and one of putting in the billing address, where we will be getting our address info, which HAS to be validated
const addressHandler = asyncHandler(async (req, res)=>{
  const userId = req.user._id;
  const addressData = req.body;

  const result = await getOrUpdateUserAddress(userId, addressData);
  res.status(result.statusCode).json({
    success: result.success,
    message: result.message,
  });
});

module.exports = { addressHandler };
