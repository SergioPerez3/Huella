import Pet from "../models/Pet.js";
import HealthRecord from "../models/HealthRecord.js";
import Weight from "../models/Weight.js";
import Document from "../models/Document.js";
import { uploadBuffer, deleteFile } from "../services/uploadService.js";
import Task from "../models/Task.js";
import Expense from "../models/Expense.js";

const allowed = [
  "name",
  "species",
  "breed",
  "birthDate",
  "sex",
  "microchip",
  "feeding",
  "allergies",
  "notes",
];
const pick = (body) =>
  Object.fromEntries(
    Object.entries(body).filter(([key]) => allowed.includes(key)),
  );

export const getPets = async (req, res, next) => {
  try {
    const pets = await Pet.find({ owner: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ data: pets });
  } catch (error) {
    next(error);
  }
};

export const createPet = async (req, res, next) => {
  try {
    const pet = await Pet.create({ ...pick(req.body), owner: req.user.id });
    res.status(201).json({ data: pet });
  } catch (error) {
    next(error);
  }
};

export const getPet = (req, res) => {
  res.status(200).json({ data: req.pet });
};

export const updatePet = async (req, res, next) => {
  try {
    Object.assign(req.pet, pick(req.body));
    await req.pet.save();
    res.status(200).json({ data: req.pet });
  } catch (error) {
    next(error);
  }
};

export const deletePet = async (req, res, next) => {
  try {
    const documents = await Document.find({ petId: req.pet._id });
    await Promise.all(
      documents.map((d) => deleteFile(d.publicId, d.resourceType)),
    );
    if (req.pet.photo?.publicId) await deleteFile(req.pet.photo.publicId);

    await Promise.all([
      HealthRecord.deleteMany({ petId: req.pet._id }),
      Weight.deleteMany({ petId: req.pet._id }),
      Document.deleteMany({ petId: req.pet._id }),
      Task.deleteMany({ petId: req.pet._id }),
      Expense.deleteMany({ petId: req.pet._id }),
    ]);
    await req.pet.deleteOne();
    res.status(200).json({ data: { message: "Pet deleted" } });
  } catch (error) {
    next(error);
  }
};

export const uploadPhoto = async (req, res, next) => {
  try {
    const result = await uploadBuffer(req.file.buffer, "pets");
    const previous = req.pet.photo?.publicId;
    req.pet.photo = { url: result.secure_url, publicId: result.public_id };
    await req.pet.save();
    if (previous) await deleteFile(previous);
    res.status(200).json({ data: req.pet });
  } catch (error) {
    next(error);
  }
};

export const deletePhoto = async (req, res, next) => {
  try {
    if (!req.pet.photo?.publicId) {
      return res.status(404).json({ error: { message: "Pet has no photo" } });
    }
    await deleteFile(req.pet.photo.publicId);
    req.pet.photo = undefined;
    await req.pet.save();
    res.status(200).json({ data: req.pet });
  } catch (error) {
    next(error);
  }
};
