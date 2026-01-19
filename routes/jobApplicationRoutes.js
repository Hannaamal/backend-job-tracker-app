import express from "express";
import userAuthCheck from "../middleware/authCheck.js";
import {
  applyForJob,
  getMyApplications,
   checkJobApplied,
   withdrawApplication,
} from "../controllers/jobApplicationController.js";

import uploadResume from "../middleware/fileUpload/resumeUpload.js";

const applyRouter = express.Router();

// User
applyRouter.get("/check/:jobId",userAuthCheck,checkJobApplied);
applyRouter.post( "/apply/:jobId",userAuthCheck,uploadResume.single("resume"),applyForJob);
applyRouter.get("/my-applications", userAuthCheck, getMyApplications);
applyRouter.delete("/withdraw/:applicationId", userAuthCheck, withdrawApplication);



export default applyRouter;
