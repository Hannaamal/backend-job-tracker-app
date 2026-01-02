// routes/interviewRoutes.js
import express from "express";
import {
  scheduleInterview,
  updateInterview,
  cancelInterview,
} from "../../controllers/admin/interviewSchedulerController.js";
import userAuthCheck from "../../middleware/authCheck.js";

const router = express.Router();

router.post("/applications/:id/interview", userAuthCheck, scheduleInterview);
router.put("/:id", userAuthCheck , updateInterview);
router.delete("/:id", userAuthCheck , cancelInterview);

export default router;
