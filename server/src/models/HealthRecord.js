import mongoose from "mongoose";

const healthRecordSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    petId: { type: mongoose.Schema.Types.ObjectId, ref: "Pet", required: true },
    type: {
      type: String,
      enum: ["vaccine", "deworming", "visit", "treatment"],
      required: true,
    },
    date: { type: Date, required: true },
    title: { type: String, required: true, trim: true },
    notes: String,
    nextDueDate: Date,
    treatment: { drug: String, dose: String, startDate: Date, endDate: Date },
  },
  { timestamps: true },
);

healthRecordSchema.index({ petId: 1, date: -1 });

export default mongoose.model("HealthRecord", healthRecordSchema);
