const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: '../.env' });
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const userRoutes = require('./routes/userRoutes')
const app = express();

app.use(cors({ //Yet to render the frontend, so origin is denoted through a placeholder for once
    origin: process.env.CORS_ORIGIN,
    credentials:true,
    preflightContinue: false
}));

app.use(express.json({
    limit: "10kb", //Now we are going to prevent DOS attacks, as they are not pretty

}));

app.use('/user', userRoutes)

app.use(rateLimit({
    windowMs: 1*60*1000,
    max:100,
    message: "Too many requests, stop or get flagged"
}));

app.use(express.urlencoded({extended:true, limit:"16kb"}));

app.use(express.static("public"));

app.use(cookieParser())


module.exports = { app };