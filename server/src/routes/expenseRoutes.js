import { Router } from "express";
import {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  getSummary,
} from "../controllers/expenseController.js";
import auth from "../middlewares/auth.js";

const router = Router();

router.use(auth);
router.get("/summary", getSummary);
router.route("/").get(getExpenses).post(createExpense);
router.route("/:id").patch(updateExpense).delete(deleteExpense);

export default router;
