import mongoose from "mongoose";
import Task from "../models/Task.js";
import pick from "../utils/pick.js";
import ownsPet from "../utils/ownsPet.js";
import { getNextDate } from "../services/recurrenceService.js";

const fields = ["title", "type", "description", "dueAt", "recurrence"];

const findTask = (req) =>
  mongoose.isValidObjectId(req.params.id)
    ? Task.findOne({ _id: req.params.id, owner: req.user.id })
    : null;

export const getTasks = async (req, res, next) => {
  try {
    const { petId, status, from, to } = req.query;
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 50, 200);

    const filter = { owner: req.user.id };
    if (petId) filter.petId = petId;
    if (status) filter.status = status;
    if (from || to) {
      filter.dueAt = {};
      if (from) filter.dueAt.$gte = new Date(from);
      if (to) filter.dueAt.$lte = new Date(to);
    }

    const [tasks, total] = await Promise.all([
      Task.find(filter)
        .sort({ dueAt: 1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Task.countDocuments(filter),
    ]);
    res.status(200).json({ data: tasks, meta: { page, limit, total } });
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const { petId } = req.body;
    if (!(await ownsPet(petId, req.user.id))) {
      return res.status(404).json({ error: { message: "Pet not found" } });
    }
    const task = await Task.create({
      ...pick(req.body, fields),
      owner: req.user.id,
      petId,
    });
    res.status(201).json({ data: task });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const task = await findTask(req);
    if (!task)
      return res.status(404).json({ error: { message: "Task not found" } });
    Object.assign(task, pick(req.body, fields));
    await task.save();
    res.status(200).json({ data: task });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const task = await findTask(req);
    if (!task)
      return res.status(404).json({ error: { message: "Task not found" } });
    await task.deleteOne();
    res.status(200).json({ data: { message: "Task deleted" } });
  } catch (error) {
    next(error);
  }
};

const closeTask = (status) => async (req, res, next) => {
  try {
    const task = await findTask(req);
    if (!task)
      return res.status(404).json({ error: { message: "Task not found" } });
    if (task.status !== "pending") {
      return res
        .status(409)
        .json({ error: { message: "Task already closed" } });
    }

    task.status = status;
    if (status === "done") task.completedAt = new Date();
    await task.save();

    const nextDate = getNextDate(task.dueAt, task.recurrence);
    const next = nextDate
      ? await Task.create({
          owner: task.owner,
          petId: task.petId,
          title: task.title,
          type: task.type,
          description: task.description,
          dueAt: nextDate,
          recurrence: task.toObject().recurrence,
        })
      : null;

    res.status(200).json({ data: { task, next } });
  } catch (error) {
    next(error);
  }
};

export const completeTask = closeTask("done");
export const skipTask = closeTask("skipped");
