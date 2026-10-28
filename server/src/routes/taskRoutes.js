import { Router } from "express";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  completeTask,
  skipTask,
} from "../controllers/taskController.js";
import auth from "../middlewares/auth.js";

const router = Router();

router.use(auth);
router.route("/").get(getTasks).post(createTask);
router.route("/:id").patch(updateTask).delete(deleteTask);
router.post("/:id/complete", completeTask);
router.post("/:id/skip", skipTask);

export default router;
