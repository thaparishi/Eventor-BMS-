const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const banquetRoutes = require("./routes/banquetRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Parse JSON request body

// Database Connection
const MONGO_URI = "mongodb+srv://reetest2003:Prap2003@bms.6dzxx.mongodb.net/?retryWrites=true&w=majority&appName=bms"; // Replace with your MongoDB URI
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api", authRoutes);  // Register routes for user authentication
app.use("/api/banquet", banquetRoutes);  // Register routes for banquet registration

// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
