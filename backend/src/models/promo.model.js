const mongoose = require('mongoose');

const promoSchema = new mongoose.Schema({
    code:{
        type:String,
        unique: true
    },

    discount_provided:{
        type: Number
    },

    used_by:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Buyer',
        unique: true
    }],

    badge:{
        type:String,
        required: true
    },

    title:{
        type: String,
        required: true,
    },

    description:{
        type: String,
        required: true
    }
});

const Promo = mongoose.model('Promo', promoSchema);
module.exports = {
    Promo
}