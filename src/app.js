const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: '../.env' });
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const userRoutes = require('./routes/auth.routes');
const addressRoutes = require('./routes/address.router');
const productRouters = require('./routes/products.router');
const adminRoutes = require('./routes/admin.routes');
const apiRoutes = require('./routes/api.routes');
const helmet = require('helmet');
const compression = require('compression');
const hpp = require('hpp');
const cartRouter = require('./routes/cart.routes');
const wishlistRouter = require('./routes/wishlist.routes');
const { errorHandler } = require('./utils/errorHandler');
const orderRoutes = require('./routes/orders.routes');
const paymentRoutes = require('./routes/paymentVerification');
const sellerRoutes = require('./routes/seller.routes');
const path = require('path');

const app = express();

app.use(cors({ //Yet to render the frontend, so origin is denoted through a placeholder for once
    origin: process.env.CORS_ORIGIN,
    credentials:true,
    preflightContinue: false
}));

app.use(express.static(path.join(__dirname, "../../ecom_connected/ecom/build")));

app.use('/api/payment/webhook', express.raw({ type: 'application/json' }));

app.use(express.json({
    limit: "10kb", //Now we are going to prevent DOS attacks, as they are not pretty

}));

app.use(helmet({
    referrerPolicy: {policy: 'no-referrer'},
}))

app.use(helmet.hidePoweredBy())
app.use(helmet.frameguard({ action: 'deny' }))
app.use(helmet.noSniff())
app.use(hpp())
app.use(compression())

app.use(rateLimit({
    windowMs: 1*60*1000,
    max:100,
    message: "Too many requests, stop or get flagged"
}));


// app.use('/edit', addressRoutes);

// app.use('/api/products', productDisplayRouters);

app.use(express.urlencoded({extended:true, limit:"16kb"}));

app.use(express.static("public"));

app.use(cookieParser())

// const csrfprotection = csrf({cookie: true})
// app.use(csrfprotection)
app.use('/user', userRoutes);
app.use('/product', productRouters);
app.use('/admin', adminRoutes);
app.use('/api', apiRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/cart', cartRouter);
app.use('/wishlist', wishlistRouter);
app.use('/orders', orderRoutes);
app.use('/seller', sellerRoutes);

app.use(errorHandler);

module.exports = { app };
