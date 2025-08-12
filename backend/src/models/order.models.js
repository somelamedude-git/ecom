const mongoose = require('mongoose');
const { Product } = require('../models/product.models');

// const preorderSchema = new mongoose.Schema({
//   order_item: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Product'
//   },
//   order_amount: {
//     type: Number,
//     required: true
//   }
// });


const orderSchema = new mongoose.Schema({
  customer: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BaseUser'
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  quantity: {
    type: Number,
    required: true
  },
  // address: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "BaseUser.address"
  // },
  status: {
    type: String,
    enum: ['confirmed', 'delivered', 'cancelled', 'schedule_return', 'returned', 'approve_return', 'shipped', 'pending'],
    default: 'pending'
  },

  size:{
    type: String,
    required:true // We do the enum part in the processing, when we push the order
  },

  total: {
    type: Number,
    required: true
  },

  razorpayOrderId: {
    type: String,
    required: false,
    trim: true,
    index: true
  },

  paymentVerified: {
    type: Boolean,
    default: false
  },

  paymentId: {
    type: String,
    required: false,
    trim: true,
    index: true
  }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
module.exports = { Order };
