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
    let infotofetch = 'username email address name coverImage isBan'

    if(type === 'buyers'){
        usertype = Buyer
        infotofetch += ' orderHistory'
    }
    else if(type === 'sellers'){
        usertype = Seller
        infotofetch += ' selling_products store_information average_rating verification_documents'
    }
    else
        usertype = Admin

    const users = await usertype.find().select(infotofetch).sort({createdAt: -1})

    return res.status(200).json({status: true, users})

})

module.exports = {fetchUsers}