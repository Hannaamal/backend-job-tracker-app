import express from "express";
import userAuthCheck from "../middleware/authCheck.js";
import {
  getMyProfile,
  updateMyProfile,
} from "../controllers/profileController.js";
import uploadProfile from "../middleware/fileUpload/profileUpload.js";
import uploadResume from "../middleware/fileUpload/resumeUpload.js";
import { check } from "express-validator";



const profileRouter = express.Router();

// const updateProfileValidator = [
//   check("phone")
//     .optional()
//     .isMobilePhone("any")
//     .withMessage("Invalid phone number"),

//   check("location")
//     .optional()
//     .trim()
//     .isLength({ min: 2 })
//     .withMessage("Location must be at least 2 characters"),

//   check("title")
//     .optional()
//     .trim()
//     .isLength({ min: 2 })
//     .withMessage("Title must be at least 2 characters"),

//   check("experienceLevel")
//     .optional()
//     .isIn(["Fresher", "1-3", "3-5", "5+"])
//     .withMessage("Invalid experience level"),

//   check("skills")
//     .optional()
//     .isArray()
//     .withMessage("Skills must be an array"),

//   check("skills.*")
//     .optional()
//     .isMongoId()
//     .withMessage("Invalid skill ID"),

//   check("summary")
//     .optional()
//     .isLength({ min: 10 })
//     .withMessage("Summary must be at least 10 characters"),

//   check("education")
//     .optional()
//     .isArray()
//     .withMessage("Education must be an array"),

//   check("education.*.degree")
//     .optional()
//     .trim()
//     .notEmpty()
//     .withMessage("Degree is required"),

//   check("education.*.institution")
//     .optional()
//     .trim()
//     .notEmpty()
//     .withMessage("Institution is required"),

//   check("education.*.year")
//     .optional()
//     .isInt({ min: 1900, max: new Date().getFullYear() })
//     .withMessage("Invalid education year"),

//   check("experience")
//     .optional()
//     .isArray()
//     .withMessage("Experience must be an array"),

//   check("experience.*.company")
//     .optional()
//     .trim()
//     .notEmpty()
//     .withMessage("Company name is required"),

//   check("experience.*.role")
//     .optional()
//     .trim()
//     .notEmpty()
//     .withMessage("Role is required"),

//   check("experience.*.startDate")
//     .optional()
//     .isISO8601()
//     .withMessage("Invalid start date"),

//   check("experience.*.endDate")
//     .optional()
//     .isISO8601()
//     .withMessage("Invalid end date"),

//   check("preferences.jobType")
//     .optional()
//     .trim(),

//   check("preferences.remoteOnly")
//     .optional()
//     .isBoolean()
//     .withMessage("remoteOnly must be boolean"),

//   check("preferences.preferredLocations")
//     .optional()
//     .isArray()
//     .withMessage("preferredLocations must be an array"),
// ];



// Get profile
profileRouter.get("/me", userAuthCheck, getMyProfile);



// Update profile
profileRouter.put("/me/update", userAuthCheck, uploadProfile.fields([
  { name: 'resume', maxCount: 1 },
  { name: 'avatar', maxCount: 1 }
]), updateMyProfile);
profileRouter.put("/me/avatar", userAuthCheck, uploadProfile.single("avatar"), updateMyProfile);


export default profileRouter;
