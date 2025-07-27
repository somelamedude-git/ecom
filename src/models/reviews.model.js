const mongoose = require('mongoose');


const reviewSchema = new mongoose.Schema({
    description:{
        type: String
    },

    product_reviewed:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },

    user_reviewd:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Buyer"
    },

    owner_of_product:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seller"
    }
}, { timestamps: true});

const Review = mongoose.model('Review', reviewSchema);

module.exports = {
    Review
}