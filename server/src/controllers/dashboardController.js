import mongoose from "mongoose";
import Pet from "../models/Pet.js";
import Task from "../models/Task.js";
import HealthRecord from "../models/HealthRecord.js";
import Weight from "../models/Weight.js";
import { summarizeMonth } from "../services/expenseService.js";

export const getDashboard = async (req, res, next) => {
  try {
    const owner = req.user.id;
    const now = new Date();
    const month = now.toISOString().slice(0, 7);

    const [
      pets,
      overdue,
      upcoming,
      upcomingHealth,
      latestWeights,
      monthExpenses,
      treatedIds,
    ] = await Promise.all([
      Pet.find({ owner })
        .select("name species breed birthDate photo.url")
        .sort({ createdAt: -1 }),
      Task.countDocuments({ owner, status: "pending", dueAt: { $lt: now } }),
      Task.find({ owner, status: "pending", dueAt: { $gte: now } })
        .sort({ dueAt: 1 })
        .limit(5),
      HealthRecord.find({ owner, nextDueDate: { $gte: now } })
        .sort({ nextDueDate: 1 })
        .limit(5)
        .select("petId type title nextDueDate"),
      Weight.aggregate([
        { $match: { owner: new mongoose.Types.ObjectId(owner) } },
        { $sort: { date: -1 } },
        {
          $group: {
            _id: "$petId",
            weights: { $push: { date: "$date", kg: "$kg" } },
          },
        },
        {
          $project: {
            _id: 0,
            petId: "$_id",
            weights: { $slice: ["$weights", 2] },
          },
        },
      ]),
      summarizeMonth(owner, month),
      HealthRecord.distinct("petId", {
        owner,
        type: "treatment",
        $or: [
          { "treatment.endDate": { $gte: now } },
          { "treatment.endDate": null },
        ],
      }),
    ]);

    const treated = new Set(treatedIds.map(String));
    const petsData = pets.map((pet) => ({
      ...pet.toObject(),
      inTreatment: treated.has(String(pet._id)),
    }));

    res.status(200).json({
      data: {
        pets: petsData,
        tasks: { overdue, upcoming },
        upcomingHealth,
        latestWeights,
        monthExpenses,
      },
    });
  } catch (error) {
    next(error);
  }
};
