const mongoose = require('mongoose');
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
  productImages: {
    type: String
},

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },

  views:{
    type: Number,
    default:0
  },

  reviews:[
    {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Review"
    }
  ],

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
  type:String
},

stock:{
  type: Map,
  of: Number,
  default: function(){ return new Map()}
},

price:{
  type: Number,
  required: true
},

times_ordered:{
  type:Number,
  default:0
},

added_to_cart:{
  type: Number,
  default: 0
},

average_age_customers:{
  type:Number,
  default:0
},

times_returned:{
  type:Number,
  default:0
} 

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