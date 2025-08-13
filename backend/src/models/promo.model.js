const mongoose = require('mongoose');

const promoSchema = new mongoose.Schema({
    code:{
        type:String,
        unique: true
    },

    discount_provided:{
        type: Number
    },

    used_by:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Buyer',
        unique: true
    }
});

const Promo = mongoose.model('Promo', promoSchema);
module.exports = {
    promoSchema
}