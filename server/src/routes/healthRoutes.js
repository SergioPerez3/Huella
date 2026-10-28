import { Router } from "express";
import {
  getRecords,
  createRecord,
  updateRecord,
  deleteRecord,
} from "../controllers/healthController.js";

const router = Router();

router.route("/").get(getRecords).post(createRecord);
router.route("/:id").patch(updateRecord).delete(deleteRecord);

export default router;
