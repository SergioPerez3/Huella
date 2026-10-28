import { Router } from "express";
import {
  getWeights,
  createWeight,
  updateWeight,
  deleteWeight,
} from "../controllers/weightController.js";

const router = Router();

router.route("/").get(getWeights).post(createWeight);
router.route("/:id").patch(updateWeight).delete(deleteWeight);

export default router;
