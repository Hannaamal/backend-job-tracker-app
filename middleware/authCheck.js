import jwt from "jsonwebtoken";
import User from "../models/user.js";
import HttpError from "../helpers/httpError.js";

const userAuthCheck = async (req, res, next) => {
  if (req.method === "OPTIONS") return next();

  try {
    // ✅ 1. Check cookies first
    let token = req.cookies?.auth_token;

    // ✅ 2. Fallback to Authorization header
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      console.log("=== TOKEN NOT FOUND DEBUG ===");
      console.log("Cookies:", req.cookies);
      console.log("Headers:", req.headers.authorization);
      console.log("=== END TOKEN NOT FOUND DEBUG ===");
      return next(new HttpError("Unauthorized", 401));
    }

    console.log("=== TOKEN FOUND DEBUG ===");
    console.log("Token:", token.substring(0, 50) + "...");
    console.log("=== END TOKEN FOUND DEBUG ===");

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    
    // Debug: Log the decoded token structure
    console.log("=== DECODED TOKEN DEBUG ===");
    console.log("Decoded token:", decodedToken);
    console.log("Token ID:", decodedToken.id);
    console.log("Token role:", decodedToken.role);
    console.log("=== END DECODED TOKEN DEBUG ===");

    const user = await User.findById(decodedToken.id);
    if (!user) {
      return next(new HttpError("User not found", 401));
    }

    req.user = user;
    req.userData = {
      userId: decodedToken.id,
      userRole: decodedToken.role,
      userEmail: user.email,
    };

    next();
  } catch (err) {
    console.log(err)
    return next(new HttpError("Authentication failed", 401));
  }
};

export default userAuthCheck;
