const mongoose = require("mongoose");

const banquetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  contact: { type: String, required: true },
  capacity: { type: Number, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
});

module.exports = mongoose.model("Banquet", banquetSchema);