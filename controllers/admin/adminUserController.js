import User from "../../models/user.js";
import Profile from "../../models/profile.js";

/**
 * ✅ GET ALL USERS (ADMIN)
 */
export const getAllUsersAdmin = async (req, res) => {
  try {
    // 🔐 Admin check
    if (req.userData.userRole !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const users = await User.find()
      .select("name email role createdAt")
      .sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

/**
 * ✅ GET SINGLE USER + PROFILE (ADMIN)
 */
export const getUserProfileAdmin = async (req, res) => {
  try {
    if (req.userData.userRole !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { userId } = req.params;

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
    res.status(500).json({
      message: "Failed to fetch user profile",
      error: error.message,
    });
  }
};
