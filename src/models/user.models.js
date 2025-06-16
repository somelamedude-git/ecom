const mongoose = require('mongoose');
const options = {discriminatorKey: 'kind', timestamps:true};

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
    defaut: ""
  },
  landmark: {
    type: String,
    required: true
  }
});

const BaseUserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    trim:true,
    index:true,
    lowercase:true
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    trim:true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim:true,
    lowercase:true
  },
  address:{
    type: addressSchema,
    required:true
  },
  name:{
    type:String,
    required:true,
    trim:true
  },

  coverImage:{
    type:String
  },

  refreshToken:{
    type:String
  }
}, options);

const BaseUser = mongoose.model("BaseUser", BaseUserSchema);

const buyerSchema = BaseUser.discriminator('Buyer', new mongoose.Schema({
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    }
  ],

  orderHistory:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order"
    }
  ],

  cart:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref: "Product"
    }
  ],

  reviews_left:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    }
  ]
}, options));

const sellerSchema = BaseUser.discriminator('Seller', new mongoose.Schema({
 selling_products: [
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    },
    status: {
      type: String,
      enum: ['sold out', 'in stock'],
      default: 'in stock',
      required: true
    }
  }
],


  store_information: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store"
  },

  average_rating:{
    type:Number,
    default:0
  },

  isVerified:{
    type:Boolean,
    default:false
  },

  verification_documents:[
    {
      type:String
    }
  ]
}, options));

const Address = mongoose.model('Address', addressSchema);

module.exports = {
  BaseUser,
  Buyer,
  Seller,
  Address
};