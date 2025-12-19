import express from "express";
import userAuthCheck from "../../middleware/authCheck.js";
import {
  createJob,
  getAllJobs,
  getJobById,
  getJobsByCompany,
  updateJob,
  deleteJob,
} from "../../controllers/jobController.js";
import { getJobs } from "../../controllers/filterController.js";

const jobRouter = express.Router();

// Public
 jobRouter.get("/", getAllJobs);
 jobRouter.get("/filter",getJobs)
 jobRouter.get("/company/:companyId", getJobsByCompany);
 jobRouter.get("/:id", getJobById);

// Admin only
 jobRouter.post("/", userAuthCheck, createJob);
 jobRouter.put("/:id", userAuthCheck, updateJob);
 jobRouter.put("/delete/:id", userAuthCheck, deleteJob);

export default  jobRouter;
