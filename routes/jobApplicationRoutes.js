import express from "express";
import userAuthCheck from "../middleware/authCheck.js";
import {
  applyForJob,
  getMyApplications,
} from "../controllers/jobApplicationController.js";
import {
  getApplicationsForJob,
  updateApplicationStatus,
} from "../controllers/adminJobApplication.js";
import uploadResume from "../middleware/fileUpload.js";

const applyRouter = express.Router();

// User
applyRouter.post( "/apply/:jobId",userAuthCheck,uploadResume.single("resume"),applyForJob);
applyRouter.get("/my-applications", userAuthCheck, getMyApplications);

// Admin
applyRouter.get("/job/:jobId", userAuthCheck, getApplicationsForJob);
applyRouter.put("/:id/status", userAuthCheck, updateApplicationStatus);

export default applyRouter;
