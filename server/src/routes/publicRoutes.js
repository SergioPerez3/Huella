import { Router } from "express";
import { getPublicCard } from "../controllers/emergencyController.js";

const router = Router();

router.get("/emergency/:token", getPublicCard);

export default router;
