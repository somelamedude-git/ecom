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
    { code: 'EFGH', discount_provided: 15, used_by: [], badge: 'VIP Access', title: '15 percent off', description: 'Exclusive deal for VIP members' },
    { code: 'IJKL', discount_provided: 20, used_by: [], badge: 'Super Savers', title: '20 percent off', description: 'Big savings for budget-conscious shoppers' },
    { code: 'MNOP', discount_provided: 5,  used_by: [], badge: 'Newbie Bonus', title: '5 percent off', description: 'Welcome discount for first-time customers' },
    { code: 'QRST', discount_provided: 25, used_by: [], badge: 'Mega Deal', title: '25 percent off', description: 'Massive discount for our valued customers' },
    { code: 'UVWX', discount_provided: 30, used_by: [], badge: 'Flash Sale', title: '30 percent off', description: 'Limited time flash sale offer' },
    { code: 'YZ12', discount_provided: 12, used_by: [], badge: 'Lucky 12', title: '12 percent off', description: 'Because 12 is your lucky number' },
    { code: '3456', discount_provided: 18, used_by: [], badge: 'Weekend Saver', title: '18 percent off', description: 'Special weekend discount on all products' },
    { code: '7890', discount_provided: 8,  used_by: [], badge: 'Early Bird', title: '8 percent off', description: 'Reward for shopping early in the day' },
    { code: 'ZXCV', discount_provided: 50, used_by: [], badge: 'Half Price Hero', title: '50 percent off', description: 'Half off for the fastest shoppers' }
];

addCodes(codes);
