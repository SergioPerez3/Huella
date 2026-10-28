import mongoose from "mongoose";
import Weight from "../models/Weight.js";
import pick from "../utils/pick.js";

const fields = ["date", "kg"];

const findWeight = (req) =>
  mongoose.isValidObjectId(req.params.id)
    ? Weight.findOne({ _id: req.params.id, petId: req.pet._id })
    : null;

export const getWeights = async (req, res, next) => {
  try {
    const { from, to } = req.query;
    const filter = { petId: req.pet._id };
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to) filter.date.$lte = new Date(to);
    }
    const weights = await Weight.find(filter).sort({ date: 1 });
    res.status(200).json({ data: weights });
  } catch (error) {
    next(error);
  }
};

export const createWeight = async (req, res, next) => {
  try {
    const weight = await Weight.create({
      ...pick(req.body, fields),
      owner: req.user.id,
      petId: req.pet._id,
    });
    res.status(201).json({ data: weight });
  } catch (error) {
    next(error);
  }
};

export const updateWeight = async (req, res, next) => {
  try {
    const weight = await findWeight(req);
    if (!weight)
      return res.status(404).json({ error: { message: "Weight not found" } });
    Object.assign(weight, pick(req.body, fields));
    await weight.save();
    res.status(200).json({ data: weight });
  } catch (error) {
    next(error);
  }
};

export const deleteWeight = async (req, res, next) => {
  try {
    const weight = await findWeight(req);
    if (!weight)
      return res.status(404).json({ error: { message: "Weight not found" } });
    await weight.deleteOne();
    res.status(200).json({ data: { message: "Weight deleted" } });
  } catch (error) {
    next(error);
  }
};
