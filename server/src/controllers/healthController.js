import mongoose from "mongoose";
import HealthRecord from "../models/HealthRecord.js";
import pick from "../utils/pick.js";

const fields = ["type", "date", "title", "notes", "nextDueDate", "treatment"];

const findRecord = (req) =>
  mongoose.isValidObjectId(req.params.id)
    ? HealthRecord.findOne({ _id: req.params.id, petId: req.pet._id })
    : null;

export const getRecords = async (req, res, next) => {
  try {
    const { type, from, to } = req.query;
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);

    const filter = { petId: req.pet._id };
    if (type) filter.type = type;
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to) filter.date.$lte = new Date(to);
    }

    const [records, total] = await Promise.all([
      HealthRecord.find(filter)
        .sort({ date: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      HealthRecord.countDocuments(filter),
    ]);
    res.status(200).json({ data: records, meta: { page, limit, total } });
  } catch (error) {
    next(error);
  }
};

export const createRecord = async (req, res, next) => {
  try {
    const record = await HealthRecord.create({
      ...pick(req.body, fields),
      owner: req.user.id,
      petId: req.pet._id,
    });
    res.status(201).json({ data: record });
  } catch (error) {
    next(error);
  }
};

export const updateRecord = async (req, res, next) => {
  try {
    const record = await findRecord(req);
    if (!record)
      return res.status(404).json({ error: { message: "Record not found" } });
    Object.assign(record, pick(req.body, fields));
    await record.save();
    res.status(200).json({ data: record });
  } catch (error) {
    next(error);
  }
};

export const deleteRecord = async (req, res, next) => {
  try {
    const record = await findRecord(req);
    if (!record)
      return res.status(404).json({ error: { message: "Record not found" } });
    await record.deleteOne();
    res.status(200).json({ data: { message: "Record deleted" } });
  } catch (error) {
    next(error);
  }
};
