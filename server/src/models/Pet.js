import mongoose from "mongoose";

const petSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    species: { type: String, enum: ["dog", "cat", "other"], required: true },
    breed: { type: String, trim: true },
    birthDate: Date,
    sex: { type: String, enum: ["male", "female"] },
    microchip: { type: String, trim: true },
    photo: { url: String, publicId: String },
    feeding: { food: String, amount: String, schedule: String },
    allergies: [String],
    notes: String,
  },
  { timestamps: true },
);

export default mongoose.model("Pet", petSchema);
