import express from "express";
import userAuthCheck from "../middleware/authCheck.js";
import {
  getMyProfile,
  updateMyProfile,
} from "../controllers/profileController.js";
import uploadProfile from "../middleware/fileUpload/profileUpload.js";
import uploadResume from "../middleware/fileUpload/resumeUpload.js";


const profileRouter = express.Router();

// Get profile
profileRouter.get("/me", userAuthCheck, getMyProfile);

// Update profile
profileRouter.put("/me", userAuthCheck,uploadResume.single("resume"), updateMyProfile);
profileRouter.put("/me/avatar", userAuthCheck, uploadProfile.single("avatar"), updateMyProfile);


export default profileRouter;
