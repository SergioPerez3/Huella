import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    petId: { type: mongoose.Schema.Types.ObjectId, ref: "Pet", required: true },
    amount: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: "Amount must be an integer (cents)",
      },
    },
    category: {
      type: String,
      enum: [
        "food",
        "vet",
        "medication",
        "vaccines",
        "grooming",
        "toys",
        "training",
        "boarding",
        "other",
      ],
      required: true,
    },
    date: { type: Date, required: true },
    description: String,
  },
  { timestamps: true },
);

expenseSchema.index({ owner: 1, date: -1 });
expenseSchema.index({ petId: 1 });

export default mongoose.model("Expense", expenseSchema);
