import jwt from "jsonwebtoken";
import User from "../models/user.js";

const optionalAuth = async (req, res, next) => {
  let token = req.cookies?.auth_token;

  if (!token && req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) return next(); // 👈 guest user allowed

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (user) {
      req.userData = {
        userId: decoded.id,
        userRole: decoded.role,
        userEmail: user.email,
      };
    }
  } catch (err) {
    // ignore token errors for guests
  }

  next();
};

export default optionalAuth;
