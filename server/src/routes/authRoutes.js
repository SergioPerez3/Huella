import { Router } from "express";
import {
  register,
  login,
  logout,
  me,
  updateMe,
  deleteMe,
} from "../controllers/authController.js";
import auth from "../middlewares/auth.js";
import { authLimiter } from "../middlewares/rateLimiters.js";

const router = Router();

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/logout", logout);
router.route("/me").get(auth, me).patch(auth, updateMe).delete(auth, deleteMe);

export default router;
