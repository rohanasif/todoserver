import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  getUserById,
  deleteUser,
} from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.route("/me").get(protect, getMe);
router
  .route("/:id")
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById);
export default router;
