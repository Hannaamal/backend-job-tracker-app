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
import { check } from "express-validator";

const jobRouter = express.Router();

const createJobValidator = [
  check("title")
    .trim()
    .notEmpty()
    .withMessage("Job title is required")
    .isLength({ min: 3 })
    .withMessage("Job title must be at least 3 characters"),

  check("description")
    .trim()
    .notEmpty()
    .withMessage("Job description is required")
    .isLength({ min: 20 })
    .withMessage("Job description must be at least 20 characters"),

  check("location")
  .if((value, { req }) => !req.body.isRemote)
  .trim()
  .notEmpty()
  .withMessage("Location is required for onsite jobs"),


  check("jobType")
    .trim()
    .notEmpty()
    .withMessage("Job type is required"),

  check("experienceLevel")
    .trim()
    .notEmpty()
    .withMessage("Experience level is required"),

  check("company")
    .notEmpty()
    .withMessage("Company ID is required"),
];

const updateJobValidator = [
  check("title")
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage("Job title must be at least 3 characters"),

  check("description")
    .optional()
    .isLength({ min: 8 })
    .withMessage("Job description must be at least 20 characters"),

  check("location")
  .if((value, { req }) => !req.body.isRemote)
  .trim()
  .notEmpty()
  .withMessage("Location is required for onsite jobs"),


  check("jobType")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Job type cannot be empty"),

  check("experienceLevel")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Experience level cannot be empty"),
];

// Public
 jobRouter.get("/", getAllJobs);
 jobRouter.get("/filter",getJobs)
 jobRouter.get("/company/:companyId", getJobsByCompany);
 jobRouter.get("/:id", getJobById);

// Admin only
 jobRouter.post("/", userAuthCheck,createJobValidator,createJob);
 jobRouter.put("/:id", userAuthCheck,updateJobValidator,updateJob);
 jobRouter.put("/delete/:id", userAuthCheck, deleteJob);

export default  jobRouter;
