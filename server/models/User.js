import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },

  password: { type: String, required: false },

  isVerified: { type: Boolean, default: false },

  otp: { type: String },
  otpExpiry: { type: Date }   // must match auth.js exactly
});

export default mongoose.model("User", UserSchema);
