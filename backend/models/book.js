const mongoose = require("mongoose");

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
});

module.exports = mongoose.model("bookDetail", bookedSchema);
