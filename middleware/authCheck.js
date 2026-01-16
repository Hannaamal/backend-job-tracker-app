import jwt from "jsonwebtoken";
import User from "../models/user.js";

const userAuthCheck = async (req, res, next) => {
  try {
    const token = req.cookies?.auth_token;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Authentication failed" });
  }
};

export default userAuthCheck;
