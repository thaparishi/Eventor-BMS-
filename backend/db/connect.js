import mongoose from "mongoose";

// Connecting to the cloud MongoDB
const connectDB = async (url) => {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error; // Rethrow the error to handle it in the calling function
  }
};

// Exporting the connectDB function as default
export default connectDB;