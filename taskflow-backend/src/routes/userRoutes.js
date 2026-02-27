const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  deleteUser,
  updateUserRole,
} = require("../controllers/userController");

// User profile routes
router.get("/profile", verifyToken, getUserProfile);
router.put("/profile", verifyToken, updateUserProfile);

// Admin route
router.get("/", verifyToken, authorizeRoles("admin"), getAllUsers);

// 🔥 New Admin Routes
router.delete("/:id", verifyToken, authorizeRoles("admin"), deleteUser);
router.put("/:id/role", verifyToken, authorizeRoles("admin"), updateUserRole);

module.exports = router;
