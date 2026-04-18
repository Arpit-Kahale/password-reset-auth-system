const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();

connectDB();

// Middlewares
app.use(cors({
  origin: "https://password-reset-auth-system.vercel.app"
}));
app.use(express.json());

// Routes
app.use("/api", require("./routes/auth"));

// Health check
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});