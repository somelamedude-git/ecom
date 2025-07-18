const mongoose = require('mongoose');

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
    enum: ['pending', 'delivered', 'cancelled', 'schedule_return', 'returned', 'approve_return'],
    default: 'pending'
  }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
module.exports = { Order };
