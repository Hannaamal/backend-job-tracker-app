// routes/adminApplicationRoutes.js
import express from "express";
import {
  getAllApplications,
  updateApplicationStatus,
} from "../../controllers/admin/adminJobApplicationController.js";
import userAuthCheck from "../../middleware/authCheck.js";


const router = express.Router();

router.get("/applications", userAuthCheck, getAllApplications);
router.put("/applications/:id/status", userAuthCheck, updateApplicationStatus);


export default router;