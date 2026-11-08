import auth from "../middlewares/auth.js";
import { Router } from "express";
import { searchServices } from "../controllers/serviceController.js";

const router = Router();
router.get("/services", auth, searchServices);

export default router;
