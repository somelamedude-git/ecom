const mongoose = require('mongoose');

const promoSchema = new mongoose.Schema({
    code:{
        type:String,
        unique: true
    },

    discount_provided:{
        type: Number
    }
});

const Promo = mongoose.model('Promo', promoSchema);
module.exports = {
    promoSchema
}