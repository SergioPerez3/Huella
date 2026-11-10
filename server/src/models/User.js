import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: false },
    timezone: { type: String, default: "Europe/Madrid" },
    avatar: { preset: String, url: String, publicId: String },
    isDemo: { type: Boolean, default: false },
    demoExpiresAt: Date,
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
