const { connectDB } = require('../backend/src/db/db');
const { app } = require('..src/app');

let isConnected = false;

module.exports = async (req, res) => {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
      console.log("✅ Database connected");
    } catch (err) {
      console.error("❌ MongoDB connection failed", err);
      return res.status(500).json({ error: "Database connection failed" });
    }
  }

  return app(req, res);
};
