const mongoose = require('mongoose');
const { DB_NAME } = require('../constants');
require('dotenv').config({ path: '../.env' });

const connectDB = async()=>{
    try{
        const conn = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`, {
           //Configs to be added
        });
        console.log(conn);
    } catch(error){
        console.error(error);
        throw error;
    }
}

module.exports = { connectDB };