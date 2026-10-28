import mongoose from "mongoose";
import Pet from "../models/Pet.js";

const ownsPet = async (petId, userId) =>
  mongoose.isValidObjectId(petId) &&
  Boolean(await Pet.exists({ _id: petId, owner: userId }));

export default ownsPet;
