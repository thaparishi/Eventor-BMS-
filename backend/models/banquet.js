import mongoose from "mongoose";

const banquetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
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
    required: [true, "Please provide description"],
  },
  banquet_location: {
    type: String,
    trim: true,
    required: [true, "Please provide banquet location"],
  },
  banquet_price: {
    type: Number,
    required: [true, "Please provide banquet price"],
  },
  image_location: {
    type: String,
    trim: true,
    required: [true, "Please provide image"],
  },
}, { timestamps: true });

export default mongoose.model("Banquet", banquetSchema);