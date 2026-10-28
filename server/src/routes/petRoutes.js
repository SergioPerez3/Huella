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
import healthRoutes from './healthRoutes.js';
import weightRoutes from './weightRoutes.js';

const router = Router();

router.use(auth);
router.use('/:petId/health', petOwnership, healthRoutes);
router.use('/:petId/weights', petOwnership, weightRoutes);

router.route("/").get(getPets).post(createPet);

router
  .route("/:petId")
  .all(petOwnership)
  .get(getPet)
  .patch(updatePet)
  .delete(deletePet);

export default router;
