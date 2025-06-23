const { asyncHandler } = require("../utils/asyncHandler");
const { Address } = require("../models/address.model");
const { BaseUser } = require("../models/user.models");
const { ApiError } = require("../utils/ApiError"); 
const { checkSimilarity } = require("../utils/address.utils")

//This will lead to the frontend page when the user has to add their address during ordering, and autofill has to be handled as well
//SO obviously, ID of the user is needed
//For that, we will be intercepting it by a middleware, which adds ID to the controller

//Now there will be two options, one of updating and one of putting in the billing address, where we will be getting our address info, which HAS to be validated
const addressHandler = asyncHandler(async (req, res) => {
  const user_id = req.user._id;
  const user = await BaseUser.findById(user_id).populate("address");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const {
    address_line_one,
    address_line_two,
    landmark,
    city,
    state,
    country,
    pincode
  } = req.body;

  if (!user.address) {
    const newAddress = await Address.create({
      address_line_one,
      address_line_two,
      landmark,
      city,
      state,
      country,
      pincode
    });

    user.address = newAddress._id;

    try {
      await user.save();
      return res.status(200).json({
        success: true,
        message: "Address added successfully!"
      });
    } catch (error) {
      throw new ApiError(500, "Failed to add address", error?.message || []);
    }
  }

  const existingAddress = user.address;

  if (
    checkSimilarity(
      existingAddress,
      address_line_one,
      address_line_two,
      landmark,
      city,
      state,
      country,
      pincode
    )
  ) {
    return res.status(200).json({
      success: false,
      message: "This address already exists"
    });
  }

  // if different, update
  try {
    await Address.findByIdAndUpdate(
      user.address._id,
      {
        address_line_one,
        address_line_two,
        landmark,
        city,
        state,
        country,
        pincode
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Address updated Successfully"
    });
  } catch (error) {
    throw new ApiError(500, "Failed to update address", error?.message || []);
  }
});

module.exports = { addressHandler };
