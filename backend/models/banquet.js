const mongoose = require("mongoose");

const banquetSchema = new mongoose.Schema({
  userId: {
    type: String,
    trim: true,
    required: [true, "Please provide user id"],
  },

  banquet_name: {
    type: String,
    trim: true,
    required: [true, "Please provide name"],
  },
  banquet_description: {
    type: String,
    trim: true,
    required: [true, "Please provide email"],
  },
  banquet_location: {
    type: String,
    trim: true,
    required: [true, "Please provide banquet location"],
  },
  banquet_price: {
    type: String,
    trim: true,
    required: [true, "Please provide banquet price"],
  },
  image_location: {
    type: String,
    trim: true,
    required: [true, "Please provide image"],
  },
});

module.exports = mongoose.model("banquet", banquetSchema);
