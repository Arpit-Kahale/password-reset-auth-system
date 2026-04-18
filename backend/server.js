const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();

// DB connect
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", require("./routes/auth"));

// 🔥 IMPORTANT FIX FOR DEPLOYMENT
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});