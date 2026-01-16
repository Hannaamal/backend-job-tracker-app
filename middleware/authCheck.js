import jwt from "jsonwebtoken";
import User from "../models/user.js";
import HttpError from "../helpers/httpError.js";

const userAuthCheck = async (req, res, next) => {
  if (req.method === "OPTIONS") return next();

  try {
    /* =====================
       1️⃣ TOKEN FROM COOKIE ONLY
    ===================== */
    const token = req.cookies?.auth_token;

    if (!token) {
      return next(new HttpError("Unauthorized", 401));
    }

    /* =====================
       2️⃣ VERIFY JWT
    ===================== */
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedToken?.id || !decodedToken?.role) {
      return next(new HttpError("Invalid token", 401));
    }

    /* =====================
       3️⃣ FIND USER
    ===================== */
    const user = await User.findById(decodedToken.id).select("-password");

    if (!user) {
      return next(new HttpError("User not found", 401));
    }

    /* =====================
       4️⃣ ATTACH USER DATA
    ===================== */
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
