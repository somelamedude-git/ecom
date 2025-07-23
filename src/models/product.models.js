const mongoose = require('mongoose');
const { asyncHandler } = require('../utils/asyncHandler');
const { createBitMask } = require('../utils/bitmask.util');

const productSchema = new mongoose.Schema({

  description: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    lowercase:true,
    required: true
  },
  productImages: [
    {
      type: String
    }
  ],

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },

  views:{
    type: Number,
    default:0
  },

  reviews:{
    type: Number,
    default:0   //This is just for ratings
  },

  popularity:{
    type:Number,
    default: 0
  },

    tags:[
      {
        type:Number,
        required:true
      }
    ],

owner: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Seller"
},

bitmask:{
  type:String,
  required:true 
},

xs:{
  
    type:Number,
    default:0
  
},

s:{
  type:Number,
  default:0
},

m:{
  type:Number,
  default:0
},

l:{
  type:Number,
  default:0
},

xl:{
  type:Number,
  default:0
},

xxl:{
  type:Number,
  default:0
},

price:{
  type: Number,
  required: true
},


}, { timestamps: true });

productSchema.pre('save', function(next) {
  if (typeof this.reviews === 'number' && typeof this.views === 'number') {
    this.popularity = parseFloat(((this.reviews + this.views) / 2).toFixed(1));
  } else {
    this.popularity = 0;
  }
  next();
});

productSchema.pre('save', function(next){
  let mask = createBitMask(this.tags);
  this.bitmask = mask;
  next();
})
const Product = mongoose.model('Product', productSchema);
module.exports = { Product };