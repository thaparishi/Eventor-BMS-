import mongoose from "mongoose";

const contactSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "Please provide name"],
  },
  gmail: {
    type: String,
    trim: true,
    required: [true, "Please provide gamil"],
  },
  number: {
    type: String,
    trim: true,
    required: [true, "Please provide number"],
  },
  to: {
    type: String,
    trim: true,
    required: [true, "Please provide to whom to send message"],
  },
  comment: {
    type: String,
    trim: true,
    required: [true, "Please provide comment"],
  },
});

export default mongoose.model("contact", contactSchema);