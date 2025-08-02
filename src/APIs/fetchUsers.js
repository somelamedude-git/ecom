const { Buyer, BaseUser, Seller, Admin} = require('../models/user.models')
const { ApiError } = require('../utils/ApiError')
const { asyncHandler } = require('../utils/asyncHandler');
const { Admin } = require('../models/user.models');

const fetchUsers = asyncHandler(async (req, res) => { // Adding authentication to this
    const {type, status, page = 1, limit = 10} = req.query;
    const user_id = req.user._id;
    const admin = await Admin.findById(user_id.toString()).select('');
    if(!admin){
        throw new ApiError(400, 'Unauthorized Access');
    }


    const allowedTypes = [
        'buyers',
        'sellers',
        'admins'
    ]

    const allowedStatus = [
        'ban',
        'unban'
    ]

    if(type && !allowedTypes.includes(type))
        throw new ApiError(400, "Type not allowed")

    if(status && !allowedStatus.includes(status))
        throw new ApiError(400, "Status request")

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

    let pageno = parseInt(page) || 1
    let limitno = parseInt(limit) || 1
    let skip = (pageno - 1) * limitno

    let statusq = {}

    if(status === 'ban')
        statusq = {isBan: true}
    else if(status === 'unban')
        statusq = {isBan: false}

    const totalUsers = await usertype.countDocuments(statusq)
 
    const users = await usertype.find(statusq).select(infotofetch).sort({createdAt: -1}).skip(skip).limit(limitno)

    return res.status(200).json({status: true, users, totalUsers, totalPages: Math.ceil(totalUsers / limitno)})

})

module.exports = {fetchUsers}