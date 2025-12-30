// routes/savedJobRoutes.js
import express from "express";
import { getSavedJobs, saveJob, removeSavedJob } from "../controllers/saveJobController.js";
import userAuthCheck from "../middleware/authCheck.js";

const saveRouter = express.Router();

// Static route must come before dynamic params
saveRouter.get("/saved", userAuthCheck, getSavedJobs); // Get all saved jobs
saveRouter.post("/:jobId/save", userAuthCheck, saveJob); // Save a job
saveRouter.delete("/:jobId/remove", userAuthCheck, removeSavedJob); // Remove saved job

export default saveRouter;
