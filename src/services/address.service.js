const { Address } = require("../models/address.model");
const { BaseUser } = require("../models/user.models");
const { ApiError } = require("../utils/ApiError");
const { checkSimilarity } = require("../utils/address.utils");

const getOrUpdateUserAddress = async (userId, addressData) => {
  const user = await BaseUser.findById(userId).populate("address");
  if (!user) throw new ApiError(404, "User not found");

  const {
    address_line_one,
    address_line_two,
    landmark,
    city,
    state,
    country,
    pincode
  } = addressData;

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
    await user.save();
    return {
      success: true,
      message: "Address added successfully!",
      statusCode: 200
    };
  }

  const existing = user.address;

  if (
    checkSimilarity(
      existing,
      address_line_one,
      address_line_two,
      landmark,
      city,
      state,
      country,
      pincode
    )
  ) {
    return {
      success: false,
      message: "This address already exists",
      statusCode: 200
    };
  }

  await Address.findByIdAndUpdate(user.address._id, {
    address_line_one,
    address_line_two,
    landmark,
    city,
    state,
    country,
    pincode
  });

  return {
    success: true,
    message: "Address updated successfully",
    statusCode: 200
  };
};

module.exports = { getOrUpdateUserAddress };
