const mongoose = require('mongoose');
const options = {discriminatorKey: 'kind', timestamps:true};
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate-v2');
const { hashPasswords } = require('../utils/password.util');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../.env' });

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

BaseUserSchema.pre("save", async function(next){
  if(!this.isModified("password")) return next();
  else{
    try{
    this.password = await hashPasswords(this.password);
    next();
  }
  catch(error){
    console.log(error);
    next(error);
  }
  }
});

BaseUserSchema.methods.isPasswordCorrect = async function(password){
  return await bcrypt.compare(password, this.password);
};

BaseUserSchema.methods.generateAccessToken = function(){
 return jwt.sign({
    _id:this._id,
    email:this.email,
    role: this.kind
  }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY
  })
};

BaseUserSchema.methods.generateRefreshAccessToken = function(){
 return jwt.sign({
    _id:this._id
  }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY
  })
};

const BaseUser = mongoose.model("BaseUser", BaseUserSchema);

const Buyer = BaseUser.discriminator('Buyer', new mongoose.Schema({
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

const Seller = BaseUser.discriminator('Seller', new mongoose.Schema({
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