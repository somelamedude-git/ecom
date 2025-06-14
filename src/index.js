const express = require('express');
const cors = require('cors');
const { connectDB } = require('./db/db');
const app = express();

app.use(cors());
app.use(express.json());

connectDB();