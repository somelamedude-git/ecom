const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  pincode: {
    type: Number,
    required: true
  },
  address_line_one: {
    type: String,
    required: true
  },
  address_line_two:{
    type:String,
    default: ""
  },
  landmark: {
    type: String,
    required: true
  },
  city:{
    type:String,
    required:true
  },
  state:{
    type:String,
    required:true
  },
  country:{
    type:String,
    required:true
  }
});

const Address = mongoose.model("Address", addressSchema);

module.exports = { Address };