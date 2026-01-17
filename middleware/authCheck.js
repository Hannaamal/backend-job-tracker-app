import jwt from "jsonwebtoken";
import User from "../models/user.js";
import HttpError from "../helpers/httpError.js";

const userAuthCheck = async (req, res, next) => {
  try {
    const token = req.cookies?.auth_token;

    if (!token) {
      return next(new HttpError("Unauthorized", 401));
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log("RAW TOKEN:", token);
    console.log("DECODED:", decodedToken);

    if (!decodedToken?.id || !decodedToken?.role) {
      return next(new HttpError("Invalid token", 401));
    }

    const user = await User.findById(decodedToken.id).select("-password");
    if (!user) {
      return next(new HttpError("User not found", 401));
    }

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
