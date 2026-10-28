import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    petId: { type: mongoose.Schema.Types.ObjectId, ref: "Pet", required: true },
    title: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: [
        "walk",
        "feeding",
        "medication",
        "grooming",
        "vet",
        "training",
        "other",
      ],
      default: "other",
    },
    description: String,
    dueAt: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "done", "skipped"],
      default: "pending",
    },
    completedAt: Date,
    recurrence: {
      frequency: {
        type: String,
        enum: ["none", "daily", "weekly", "monthly"],
        default: "none",
      },
      interval: { type: Number, min: 1, default: 1 },
      until: Date,
    },
  },
  { timestamps: true },
);

taskSchema.index({ owner: 1, dueAt: 1, status: 1 });
taskSchema.index({ petId: 1 });

export default mongoose.model("Task", taskSchema);
