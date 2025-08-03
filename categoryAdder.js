const { Category } = require('./src/models/category.models');
const mongoose = require('mongoose');
const { DB_NAME } = require('./src/constants');
require('dotenv').config({ path: './.env' });

const connectDB = async()=>{
    try{
        const conn = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`, {
        });
        console.log(conn);
    } catch(error){
        console.error(error);
        throw error;
    }
}

const addCategories = async (categories = []) => {
  try {
    await connectDB();
    await Category.insertMany(categories);
    console.log('Categories added successfully!');
  } catch (err) {
    console.error('Error adding categories:', err);
    throw new Error('Failed to insert categories');
  }finally{
    await mongoose.disconnect();
  }
};

const categories = [{
    name: "Men's",
    products: []
},
{
    name: "Women's",
    products: []
},

{
    name: "Footwear",
    products: []
},

{
    name: "Accessories",
    products: []
},

{
    name: "Makeup",
    products: []
}
]

addCategories(categories);