const { asyncHandler } = require('../utils/asyncHandler');
const { ApiError } = require('../utils/ApiError');
const { Buyer } = require('../models/user.models.js');

const fetchLength = asyncHandler(async(req, res)=>{
    const user_id = req.user._id; // This will obviously only show up if the user is logged in, we are accessing tokens from tokens
    
    })
