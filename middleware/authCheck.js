import jwt from "jsonwebtoken";
import User from "../models/user.js";
import HttpError from "../helpers/httpError.js";

const userAuthCheck = async (req, res, next) => {
  if (req.method === "OPTIONS") return next();

  try {
    // Debug: Log incoming request info
    console.log("=== AUTH MIDDLEWARE DEBUG ===");
    console.log("Request URL:", req.originalUrl);
    console.log("Cookies:", req.cookies);
    console.log("Authorization header:", req.headers.authorization);
    console.log("auth_token cookie:", req.cookies?.auth_token);
    console.log("=== END AUTH DEBUG ===");

    // ✅ 1. Get token from cookie FIRST - check both possible names
    let token = req.cookies?.auth_token;

    // ✅ 2. Fallback to Authorization header
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      console.log("❌ No token found - returning 401");
      return next(new HttpError("Unauthorized", 401));
    }

    console.log("✅ Token found:", token.substring(0, 50) + "...");

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

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
    return next(new HttpError("Authentication failed", 401));
  }
};

export default userAuthCheck;
