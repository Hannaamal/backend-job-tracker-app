import jwt from "jsonwebtoken";
import User from "../models/user.js";
import HttpError from "../helpers/httpError.js";

const userAuthCheck = async (req, res, next) => {
  if (req.method === "OPTIONS") return next();

  try {
    const authHeader = req.headers.authorization;

    //  Check header
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new HttpError("Unauthorized", 401));
    }

    //  Extract token
    const token = authHeader.split(" ")[1];
    if (!token) {
      return next(new HttpError("Unauthorized", 401));
    }

    //  Verify token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    //  Find user
    const user = await User.findById(decodedToken.id);
    if (!user) {
      return next(new HttpError("User not found", 401));
    }

    //  Attach user data
    
     req.userData = {
      userId: decodedToken.id,  // match what you signed
      userRole: decodedToken.role,
      userEmail: user.email,    // can fetch from DB
    };

    next();
  } catch (err) {
    return next(new HttpError("Authentication failed", 401));
  }
};

export default userAuthCheck;
