import express from "express";
import {
  getTodos,
  createTodo,
  updateTodo,
  toggleTodo,
  deleteTodo,
} from "../controllers/todoController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, createTodo).get(protect, getTodos);
router
  .route("/:id")
  .put(protect, updateTodo)
  .patch(protect, toggleTodo)
  .delete(protect, deleteTodo);

export default router;
