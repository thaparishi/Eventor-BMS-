const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config(); // Load .env variables

const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:3000" })); // Allow frontend to access the backend
app.use(bodyParser.json()); // Parse JSON request body

// Database Connection
const MONGO_URI = process.env.MONGO_URI;
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit the process if DB connection fails
  });

// Routes
app.use("/api", authRoutes); // Register routes for user authentication

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
