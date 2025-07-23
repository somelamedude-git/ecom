const mongoose = require('mongoose');
const options = {discriminatorKey: 'kind', timestamps:true};
const { hashPasswords } = require('../utils/password.util');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../.env' });
const { addressSchema } = require('./address.model');
const crypto = require('crypto');



const BaseUserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    trim:true,
    index:true,
    lowercase:true
  },

  googleLogin:{
    type:Boolean,
    default:false
  },

  password: {
    type: String,
    required: function(){
      return !this.googleLogin;
    },
    trim:true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim:true,
    lowercase:true
  },
  address:[addressSchema],
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
  },

  isVerified: {
    type: Boolean,
    default: false
  },

  isBan: {
    type: Boolean,
    default: false
  },

  verificationToken:{
    type:String
  },

  verificationTokenExpire:{
    type:Date
  },

  phone_number:{
    type: String,
    required: true
  }
}, options);

BaseUserSchema.pre("save", async function(next){
  if(this.googleLogin) return next();
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

BaseUserSchema.methods.getVerificationToken = function(){
  const token = crypto.randomBytes(29).toString('hex');
  this.verificationToken = crypto
  .createHash('sha256')
  .update(token)
  .digest('hex');

  this.verificationTokenExpire = Date.now() + 30 * 60 * 1000;
  return token;
}

const BaseUser = mongoose.model("BaseUser", BaseUserSchema);

const BuyerSchema = new mongoose.Schema({
  wishlist: [
    {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    },

    size: {
      type: String, enum:['XS', 'S', 'M', 'L', 'XL', 'XXL']
    }
  }
  ],

  orderHistory:[
    [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order"
    }
  ]
  ],

  cart:[
    {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    quantity: { type: Number, default: 1 },
    size:{type: String, enum: ['XS', 'S', 'M', 'XL', 'XXL']}
    }
  ],

  age:{
    type:Number,
    required:true
  },

  ageBucket:{
    type:Number
  },

  recommend_masking:{
    type:String,
    // required:true, to be added again when you figure out the tafs
  },

  prev_order_bit:{
    type:String
  },

  creditPoints:{
    type: Number, 
    default : 0
  }
}, options);

BuyerSchema.pre('save', function(next){
  this.ageBucket = Math.floor(this.age/10);
  this.ageBucket*=10; //We take a margin of 10, because im lazy and 26 is basically 20 ;)
  next();
});

BuyerSchema.index({"ageBucket":1});

const Buyer = BaseUser.discriminator('Buyer', BuyerSchema);

const SellerSchema =  new mongoose.Schema({
 selling_products: [
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
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

  age:{
    type: Number,
    required: true // ill do something with this
  },

  isVerified:{
    type:Boolean,
    default:false
  },

  verification_documents:[
    {
      type:String
    }
  ],

  order_quo:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order"
    }
  ]
}, options);

const Seller = BaseUser.discriminator('Seller', SellerSchema);

const AdminSchema = new mongoose.Schema({

  product_management: [{
    type: String,
    enum: ['edit_product', 'delete_product']
  }],

  user_management: [{
    type: String,
    enum: ['ban_user', 'unban_user', 'delete_user']
  }],

  review_management: [{
    type: String,
    enum: ['delete_review']
  }]
}, options)

const Admin = BaseUser.discriminator('Admin', AdminSchema);


module.exports = {
  BaseUser,
  Buyer,
  Seller,
  Admin
};