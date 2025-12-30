import express from "express";
import userAuthCheck from "../../middleware/authCheck.js";
import {
  getAllUsersAdmin,
  getUserProfileAdmin,
} from "../../controllers/admin/adminUserController.js";

const router = express.Router();

// 🔐 Admin only
router.get("/", userAuthCheck, getAllUsersAdmin);
router.get("/:userId", userAuthCheck, getUserProfileAdmin);

export default router;
