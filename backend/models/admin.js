import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "editor", "user"],
    default: "user",
  },
});

// Add password matching method
adminSchema.methods.matchPassword = async function (enteredPassword) {
  return enteredPassword === this.password;
};

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;