import { validationResult } from "express-validator";
import Profile from "../models/profile.js";
import User from "../models/user.js";

/**
 * GET MY PROFILE 
 * - Profile ALWAYS exists
 * - Name & email come from User
 */
export const getMyProfile = async (req, res, next) => {
  try {
    const userId = req.userData.userId;

    const user = await User.findById(userId).select("name email role");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

     const profile = await Profile.findOne({ user: userId })
      .populate("skills", "_id name");

    res.status(200).json({
      user,
      profile,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * UPDATE MY PROFILE
 * - Updates only profile fields
 * - Name/email/password NOT touched
 */
export const updateMyProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors.array(),
      });
    }
    const userId = req.userData.userId;

    ["skills", "education", "experience"].forEach((field) => {
      if (req.body[field]) {
        req.body[field] = JSON.parse(req.body[field]);
      }
    });

    if (req.files?.avatar) {
      req.body.avatar = `/uploads/profiles/${req.files.avatar[0].filename}`;
    }

    if (req.files?.resume) {
      req.body.resume = {
        url: `/uploads/resumes/${req.files.resume[0].filename}`,
        uploadedAt: new Date(),
      };
    }

    

    delete req.body.user;

    const profile = await Profile.findOneAndUpdate(
      { user: userId },
      { $set: req.body },
      { new: true, runValidators: true })
      .populate("skills", "name");//IMPORTANT

    res.status(200).json({ profile });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

