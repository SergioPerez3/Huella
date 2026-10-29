import User from "../models/User.js";
import Pet from "../models/Pet.js";
import HealthRecord from "../models/HealthRecord.js";
import Weight from "../models/Weight.js";
import Document from "../models/Document.js";
import Task from "../models/Task.js";
import Expense from "../models/Expense.js";
import { deleteFile } from "./uploadService.js";

export const deleteAccountData = async (userId) => {
  const [documents, pets] = await Promise.all([
    Document.find({ owner: userId }),
    Pet.find({ owner: userId }),
  ]);

  await Promise.allSettled([
    ...documents.map((d) => deleteFile(d.publicId, d.resourceType)),
    ...pets
      .filter((p) => p.photo?.publicId)
      .map((p) => deleteFile(p.photo.publicId)),
  ]);

  await Promise.all([
    HealthRecord.deleteMany({ owner: userId }),
    Weight.deleteMany({ owner: userId }),
    Document.deleteMany({ owner: userId }),
    Task.deleteMany({ owner: userId }),
    Expense.deleteMany({ owner: userId }),
    Pet.deleteMany({ owner: userId }),
  ]);
  await User.deleteOne({ _id: userId });
};
