import mongoose from "mongoose";
import Expense from "../models/Expense.js";

export const summarizeMonth = async (userId, month, petId) => {
  const [year, mon] = month.split("-").map(Number);
  const match = {
    owner: new mongoose.Types.ObjectId(userId),
    date: {
      $gte: new Date(Date.UTC(year, mon - 1, 1)),
      $lt: new Date(Date.UTC(year, mon, 1)),
    },
  };
  if (petId) match.petId = new mongoose.Types.ObjectId(petId);

  const byCategory = await Expense.aggregate([
    { $match: match },
    {
      $group: {
        _id: "$category",
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
    { $sort: { total: -1 } },
    { $project: { _id: 0, category: "$_id", total: 1, count: 1 } },
  ]);

  const total = byCategory.reduce((sum, c) => sum + c.total, 0);
  const count = byCategory.reduce((sum, c) => sum + c.count, 0);
  return { month, total, count, byCategory };
};
