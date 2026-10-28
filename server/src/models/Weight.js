import mongoose from "mongoose";

const weightSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    petId: { type: mongoose.Schema.Types.ObjectId, ref: "Pet", required: true },
    date: { type: Date, required: true },
    kg: { type: Number, required: true, min: 0 },
  },
  { timestamps: true },
);

weightSchema.index({ petId: 1, date: 1 });

export default mongoose.model("Weight", weightSchema);
