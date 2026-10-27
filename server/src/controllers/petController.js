import Pet from "../models/Pet.js";

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
    await req.pet.deleteOne();
    res.status(200).json({ data: { message: "Pet deleted" } });
  } catch (error) {
    next(error);
  }
};
