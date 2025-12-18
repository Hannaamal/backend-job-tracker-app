import express from "express";
import userAuthCheck from "../middleware/authCheck.js";
import {
  getMyProfile,
  updateMyProfile,
} from "../controllers/profileController.js";


const profileRouter = express.Router();

// Get profile
profileRouter.get("/me", userAuthCheck, getMyProfile);

// Update profile
profileRouter.put("/me", userAuthCheck, updateMyProfile);

export default profileRouter;
