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

    const profile = await Profile.findOne({ user: userId });

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
export const updateMyProfile = async (req, res, next) => {
  try {
    const userId = req.userData.userId;

    const profile = await Profile.findOneAndUpdate(
      { user: userId },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      profile,
    });
  } catch (error) {
    next(error);
  }
};
