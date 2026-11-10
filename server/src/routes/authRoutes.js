import { Router } from "express";
import {
  register,
  login,
  demoLogin,
  logout,
  me,
  updateMe,
  deleteMe,
  uploadAvatar,
  deleteAvatar,
} from "../controllers/authController.js";
import auth from "../middlewares/auth.js";
import { authLimiter } from "../middlewares/rateLimiters.js";
import { uploadImage } from "../middlewares/upload.js";

const router = Router();

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/demo", authLimiter, demoLogin);
router.post("/logout", logout);
router.route("/me").get(auth, me).patch(auth, updateMe).delete(auth, deleteMe);
router.post("/me/avatar", auth, uploadImage, uploadAvatar);
router.delete("/me/avatar", auth, deleteAvatar);

export default router;
