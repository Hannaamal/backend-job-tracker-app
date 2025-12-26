import jwt from "jsonwebtoken";
import User from "../models/user.js";
import HttpError from "../helpers/httpError.js";

const userAuthCheck = async (req, res, next) => {
  if (req.method === "OPTIONS") return next();

  try {
    // ✅ 1. Get token from cookie FIRST
    let token = req.cookies?.auth_token;

    // ✅ 2. Fallback to Authorization header
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(new HttpError("Unauthorized", 401));
    }

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
