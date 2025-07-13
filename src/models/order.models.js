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
    ref: 'BaseUser',
    required: true
  },
  items: [preorderSchema],
  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'delivered', 'cancelled', 'schedule_return', 'returned', 'approve_return'],
    default: 'pending'
  },
  totalAmount: {
    type: Number,
    required: true
  }
}, { timestamps: true });


const Order = mongoose.model('Order', orderSchema);
module.exports = { Order };
