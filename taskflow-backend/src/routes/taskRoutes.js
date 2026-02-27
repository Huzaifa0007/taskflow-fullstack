const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  createTask,
  getMyTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getAllTasks,
  getDashboardStats,
} = require("../controllers/taskController");

// Admin route
router.get("/admin/all", verifyToken, authorizeRoles("admin"), getAllTasks);
router.get("/dashboard", verifyToken, getDashboardStats);
// User routes
router.post("/", verifyToken, createTask);
router.get("/", verifyToken, getMyTasks);
router.get("/:id", verifyToken, getTaskById);
router.put("/:id", verifyToken, updateTask);
router.delete("/:id", verifyToken, deleteTask);

module.exports = router;
