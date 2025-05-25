import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  desc: {
    type: String,
    required: true,
    trim: true
  },
  auther: { 
    type: String,
    required: true,
    trim: true
  },
  read: {
    type: String,
    default: "5 min read"
  },
  postedDate: {
    type: String,
    default: function() {
      const now = new Date();
      const hours = Math.floor((new Date() - now.setHours(0,0,0,0)) / 3600000);
      if (hours < 24) {
        return `${hours} hours ago`;
      } else {
        return now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
    }
  },
  text: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Blog", BlogSchema);