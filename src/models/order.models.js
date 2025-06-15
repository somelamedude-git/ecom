const mongoose = require('mongoose');

const preorderSchema = new mongoose.Schema({
  order_item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  order_amount: {
    type: Number,
    required: true
  }
});


const orderSchema = new mongoose.Schema({
  customer: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  price: {
    type: Number,
    required: true
  },
  orderItems: [preorderSchema],
  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BaseUser.address"
  },
  status: {
    type: String,
    enum: ['pending', 'delivered', 'cancelled'],
    default: 'pending'
  }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
module.exports = { Order };
