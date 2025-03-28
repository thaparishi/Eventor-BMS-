// models/admin.js
import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "owner"], default: "owner" },
  banquetId: { type: mongoose.Schema.Types.ObjectId, ref: "Banquet" } // Only for owners
});

const AdminModel = mongoose.model("Admin", adminSchema);
export default AdminModel;