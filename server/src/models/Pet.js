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
    emergency: {
      enabled: { type: Boolean, default: false },
      publicToken: { type: String, unique: true, sparse: true },
      ownerPhone: { type: String, trim: true },
      vetContact: { type: String, trim: true },
      instructions: { type: String, trim: true },
      showAllergies: { type: Boolean, default: false },
      showMedication: { type: Boolean, default: false },
    },
  },
  { timestamps: true },
);

export default mongoose.model("Pet", petSchema);
