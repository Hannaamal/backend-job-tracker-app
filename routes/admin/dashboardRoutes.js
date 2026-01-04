import express from "express";
import { getDashboardStats } from "../../controllers/admin/dashboardController.js";
import userAuthCheck from "../../middleware/authCheck.js";

const router = express.Router();

router.get("/dashboard",userAuthCheck , getDashboardStats);
export default router;
