import mongoose from "mongoose";

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
  location_coordinates: {
    type: {
      lat: String,
      lon: String
    },
    required: [true, "Please provide location coordinates"]
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

export default mongoose.model("banquet", banquetSchema);