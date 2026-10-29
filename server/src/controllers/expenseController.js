import mongoose from "mongoose";
import Expense from "../models/Expense.js";
import pick from "../utils/pick.js";
import ownsPet from "../utils/ownsPet.js";
import { summarizeMonth } from "../services/expenseService.js";

const fields = ["amount", "category", "date", "description"];

const findExpense = (req) =>
  mongoose.isValidObjectId(req.params.id)
    ? Expense.findOne({ _id: req.params.id, owner: req.user.id })
    : null;

export const getExpenses = async (req, res, next) => {
  try {
    const { petId, category, from, to } = req.query;
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);

    const filter = { owner: req.user.id };
    if (petId) filter.petId = petId;
    if (category) filter.category = category;
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to) filter.date.$lte = new Date(to);
    }

    const [expenses, total] = await Promise.all([
      Expense.find(filter)
        .sort({ date: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Expense.countDocuments(filter),
    ]);
    res.status(200).json({ data: expenses, meta: { page, limit, total } });
  } catch (error) {
    next(error);
  }
};

export const createExpense = async (req, res, next) => {
  try {
    const { petId } = req.body;
    if (!(await ownsPet(petId, req.user.id))) {
      return res.status(404).json({ error: { message: "Pet not found" } });
    }
    const expense = await Expense.create({
      ...pick(req.body, fields),
      owner: req.user.id,
      petId,
    });
    res.status(201).json({ data: expense });
  } catch (error) {
    next(error);
  }
};

export const updateExpense = async (req, res, next) => {
  try {
    const expense = await findExpense(req);
    if (!expense)
      return res.status(404).json({ error: { message: "Expense not found" } });
    Object.assign(expense, pick(req.body, fields));
    await expense.save();
    res.status(200).json({ data: expense });
  } catch (error) {
    next(error);
  }
};

export const deleteExpense = async (req, res, next) => {
  try {
    const expense = await findExpense(req);
    if (!expense)
      return res.status(404).json({ error: { message: "Expense not found" } });
    await expense.deleteOne();
    res.status(200).json({ data: { message: "Expense deleted" } });
  } catch (error) {
    next(error);
  }
};

export const getSummary = async (req, res, next) => {
  try {
    const { month, petId } = req.query;
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month || "")) {
      return res
        .status(400)
        .json({ error: { message: "month must have the format YYYY-MM" } });
    }
    if (petId && !mongoose.isValidObjectId(petId)) {
      return res.status(400).json({ error: { message: "Invalid petId" } });
    }
    res
      .status(200)
      .json({ data: await summarizeMonth(req.user.id, month, petId) });
  } catch (error) {
    next(error);
  }
};
