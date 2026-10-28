import { Router } from "express";
import {
  getPets,
  createPet,
  getPet,
  updatePet,
  deletePet,
} from "../controllers/petController.js";
import auth from "../middlewares/auth.js";
import petOwnership from "../middlewares/petOwnership.js";
import healthRoutes from "./healthRoutes.js";
import weightRoutes from "./weightRoutes.js";
import documentRoutes from "./documentRoutes.js";
import { uploadImage } from "../middlewares/upload.js";
import { uploadPhoto, deletePhoto } from "../controllers/petController.js";

const router = Router();

router.use(auth);
router.use("/:petId/health", petOwnership, healthRoutes);
router.use("/:petId/weights", petOwnership, weightRoutes);
router.use("/:petId/documents", petOwnership, documentRoutes);

router.route("/").get(getPets).post(createPet);

router
  .route("/:petId/photo")
  .all(petOwnership)
  .post(uploadImage, uploadPhoto)
  .delete(deletePhoto);

router
  .route("/:petId")
  .all(petOwnership)
  .get(getPet)
  .patch(updatePet)
  .delete(deletePet);

export default router;
