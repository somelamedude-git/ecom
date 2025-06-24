const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({

  description: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    lowecase:true,
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

 reviews: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  },
],

 status: {
      type: String,
      enum: ['sold out', 'in stock'],
      default: 'in stock',
      required: true
    },

owner: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Seller"
}
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
module.exports = { Product };