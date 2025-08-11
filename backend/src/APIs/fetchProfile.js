const { asyncHandler } = require('../utils/asyncHandler');
const { ApiError } = require('../utils/ApiError');
const { BaseUser }= require('../models/user.models');

const fetchUserData = asyncHandler(async (req, res) => {
    if (!req.user || !req.user._id) {
        throw new ApiError(401, 'Unauthorized');
    }

    const user = await BaseUser.findById(req.user._id.toString()).select('-password').lean();
    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    const address = Array.isArray(user.address) ? user.address : [];
    const year = new Date(user.createdAt).getFullYear();
    user.joinYear = year;

    const address_object = address.map((addr) => ({
        formatted: `${addr.address_line_one} ${addr.address_line_two} ${addr.landmark} ${addr.city} ${addr.state} - ${addr.pincode}, ${addr.country}`
    }));

    res.status(200).json({ user, addresses: address_object });
});


//After this we have update user data

module.exports = {
    fetchUserData
}