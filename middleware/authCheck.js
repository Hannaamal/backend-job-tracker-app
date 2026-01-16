import jwt from "jsonwebtoken";
import User from "../models/user.js";
import HttpError from "../helpers/httpError.js";

const userAuthCheck = async (req, res, next) => {
  if (req.method === "OPTIONS") return next();

  try {
    let token;

    // 1️⃣ Try Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // 2️⃣ Fallback: cookie (optional safety)
    if (!token && req.cookies?.auth_token) {
      token = req.cookies.auth_token;
    }

    if (!token) {
      return next(new HttpError("Unauthorized", 401));
    }

    // 3️⃣ Verify token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedToken?.id || !decodedToken?.role) {
      return next(new HttpError("Invalid token", 401));
    }

    // 4️⃣ Find user
    const user = await User.findById(decodedToken.id).select("-password");
    if (!user) {
      return next(new HttpError("User not found", 401));
    }

    // 5️⃣ Attach user
    req.user = user;
    req.userData = {
      userId: user._id,
      userRole: user.role,
      userEmail: user.email,
    };

    next();
  } catch (err) {
    return next(new HttpError("Authentication failed", 401));
  }
};


export default userAuthCheck;
