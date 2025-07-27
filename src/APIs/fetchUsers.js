const { Buyer, BaseUser, Seller, Admin} = require('../models/user.models')
const { ApiError } = require('../utils/ApiError')
const { asyncHandler } = require('../utils/asyncHandler')

const fetchUsers = asyncHandler(async (req, res) => {
    const {type} = req.query

    const allowedTypes = [
        'buyers',
        'sellers',
        'admins'
    ]

    if(type && !allowedTypes.includes(type))
        throw new ApiError(400, "Type not allowed")

    let usertype = BaseUser

    if(type === 'buyers')
        usertype = Buyer
    else if(type === 'sellers')
        usertype = Seller
    else
        usertype = Admin

    const users = await usertype.find().sort({createdAt: -1})

    return res.status(200).json({status: true, users})

})

module.exports = {fetchUsers}