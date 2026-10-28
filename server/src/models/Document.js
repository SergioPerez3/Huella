import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    petId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pet",
      required: true,
      index: true,
    },
    recordId: { type: mongoose.Schema.Types.ObjectId, ref: "HealthRecord" },
    name: { type: String, required: true, trim: true },
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    resourceType: { type: String, default: "image" },
    mimeType: String,
    size: Number,
  },
  { timestamps: true },
);

export default mongoose.model("Document", documentSchema);
