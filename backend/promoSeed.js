const { Promo } = require('./src/models/promo.model');
const { DB_NAME } = require('./src/constants');
const { default: mongoose } = require('mongoose');
require('dotenv').config({ path: './.env' });

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log('✅ MongoDB Connected');
        return conn;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const addCodes = async (codes = []) => {
    try {
        await connectDB();

        await mongoose.connection.collection('promos')
            .dropIndex('used_by_1')
            .catch(err => {
                if (err.code === 27) console.log('ℹ️ Index not found, skipping');
                else throw err;
            });

        await Promo.insertMany(codes);
        console.log('✅ Promo codes added successfully');
    } catch (error) {
        console.error('❌ Error adding promo codes:', error);
    } finally {
        await mongoose.disconnect();
    }
};

const codes = [
    { code: 'ETHNIC20', discount_provided: 20, used_by: [], badge: 'Katrina Kaif', title: 'Ethnic Diva', 
        description: 'Why be angelina jolie when you can be bebo?' }
];

addCodes(codes);
