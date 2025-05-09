import mongoose from "mongoose";

const bookedSchema = mongoose.Schema({
  bookUserId: {
    type: String,
    trim: true,
    required: [true, "Please provide user id"],
  },
  banquetName: {
    type: String,
    trim: true,
    required: [true, "Please provide user id"],
  },
  shift: {
    type: String,
    trim: true,
    required: [true, "Please provide shift"],
  },
  date: [
    {
      type: String,
      trim: true,
      required: [true, "Please provide date"],
    },
  ],
  guest: [
    {
      type: String,
      trim: true,
      required: [true, "Please provide guest"],
    },
  ],
  type: [
    {
      type: String,
      trim: true,
      required: [true, "Please provide type of wedding"],
    },
  ],
  starters: [
    {
      type: String,
      trim: true,
      required: [true, "Please provide break fast"],
    },
  ],
  mainCourse: [
    {
      type: String,
      trim: true,
      required: [true, "Please provide dinner"],
    },
  ],
  desert: [
    {
      type: String,
      trim: true,
      required: [true, "Please provide desert"],
    },
  ],
  status: {
    type: String,
    enum: ["booked", "confirmed", "cancelled"],
    default: "booked",
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("bookDetail", bookedSchema);