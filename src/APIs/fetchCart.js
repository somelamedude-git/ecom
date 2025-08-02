const { asyncHandler } = require('../utils/asyncHandler');
const { ApiError } = require('../utils/ApiError');

const fetchCart = asyncHandler(async(req, res)=>{
    console.log('fetching the cart api');
    console.log(req.cart);
    const cart_items = req.cart;
    const cart_length = cart_items.length;
    console.log(cart_length);

    return res.status(200).json({ // let's just put in stock or not only in fetch cart, bingo
        success: true,
        cart: cart_items, // we export cart, we map it, ultimately items ke hum properties chori kr lenge frontend mein
        cart_length: cart_length
    })
});


module.exports = {
    fetchCart
}