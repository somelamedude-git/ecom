const mongoose = require('mongoose');

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
  price: {
    type: Number,
    required: true,
    default: 0
  },
  stock: {
    type: Number,
    default: 0
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

  reviews:{
    type: Number,
    default:0   //This is just for ratings
  },

  popularity:{
    type:Number,
    default: 0
  },

 status: {
      type: String,
      enum: ['sold out', 'in stock'],
      default: 'in stock',
      required: true
    },

    tags:[
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag'
      }
    ],

owner: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Seller"
},

bitmask:{
  type:Number,
  required:true // we are gonna be smart here, storing a string is dumb
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
const Product = mongoose.model('Product', productSchema);
module.exports = { Product };