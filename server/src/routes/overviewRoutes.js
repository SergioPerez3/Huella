import { Router } from "express";
import { getAllRecords } from "../controllers/healthController.js";
import { getAllDocuments } from "../controllers/documentController.js";
import auth from "../middlewares/auth.js";

const router = Router();

router.get("/health-records", auth, getAllRecords);
router.get("/documents", auth, getAllDocuments);

export default router;
