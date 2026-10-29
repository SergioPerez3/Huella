import { Router } from "express";
import {
  updateEmergency,
  regenerateToken,
} from "../controllers/emergencyController.js";

const router = Router();

router.patch("/", updateEmergency);
router.post("/regenerate", regenerateToken);

export default router;
