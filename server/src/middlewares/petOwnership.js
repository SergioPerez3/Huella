import mongoose from "mongoose";
import Pet from "../models/Pet.js";

const petOwnership = async (req, res, next) => {
  try {
    const { petId } = req.params;
    if (!mongoose.isValidObjectId(petId)) {
      return res.status(404).json({ error: { message: "Pet not found" } });
    }
    const pet = await Pet.findOne({ _id: petId, owner: req.user.id });
    if (!pet)
      return res.status(404).json({ error: { message: "Pet not found" } });
    req.pet = pet;
    next();
  } catch (error) {
    next(error);
  }
};

export default petOwnership;
