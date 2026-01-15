import jwt from "jsonwebtoken";
import User from "../models/user.js";
import HttpError from "../helpers/httpError.js";

const userAuthCheck = async (req, res, next) => {
  if (req.method === "OPTIONS") return next();

   try {
    const authHeader = req.headers.authorization;

    // 1️⃣ Check header
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new HttpError("Unauthorized", 401));
    }

    // 2️⃣ Extract token
    const token = authHeader.split(" ")[1];
    if (!token) {
      return next(new HttpError("Unauthorized", 401));
    }

    // 3️⃣ Verify token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // 4️⃣ Find user
    const user = await User.findById(decodedToken.id);
    if (!user) {
      return next(new HttpError("User not found", 401));
    }

    // 5️⃣ Attach user data
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
