import { Router } from "express";
import {
  getDocuments,
  createDocument,
  deleteDocument,
} from "../controllers/documentController.js";
import { uploadDocument } from "../middlewares/upload.js";

const router = Router();

router.route("/").get(getDocuments).post(uploadDocument, createDocument);
router.delete("/:id", deleteDocument);

export default router;
