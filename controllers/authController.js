import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Profile from "../models/profile.js";

/*REGISTER*/
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check existing user
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Assign role (first user = admin)
    const usersCount = await User.countDocuments();
    const role = usersCount === 0 ? "admin" : "user";

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });
    await Profile.create({
      user: user._id,
    });

    // Generate token
    const tokenPayload = { id: user._id, role: user.role };
    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_TOKEN_EXPIRY }
    );
    
    // Debug: Log the token payload and structure
    console.log("=== JWT DEBUG INFO ===");
    console.log("Token payload:", tokenPayload);
    console.log("Token (first 50 chars):", token.substring(0, 50) + "...");
    console.log("User role:", user.role);
    console.log("User ID:", user._id);
    console.log("=== END JWT DEBUG ===");
    
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });
    res.cookie("user_role", user.role, {
      httpOnly: false,
      secure: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });
    
    // Debug: Log cookie settings
    console.log("=== COOKIE SET DEBUG ===");
    console.log("auth_token cookie set with value:", token.substring(0, 50) + "...");
    console.log("user_role cookie set with value:", user.role);
    console.log("NODE_ENV:", process.env.NODE_ENV);
    console.log("secure flag:", process.env.NODE_ENV === "production");
    console.log("=== END COOKIE DEBUG ===");

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Registration failed", error: error.message });
  }
  // next()
};

/*LOGIN*/
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_TOKEN_EXPIRY }
    );
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });
    res.cookie("user_role", user.role, {
      httpOnly: false,
      secure: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
  // next()
};

/* ======================
   GET CURRENT USER
====================== */
export const me = async (req, res) => {
  res.status(200).json({
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
};

/* ======================
   LOGOUT
====================== */
export const logout = (req, res) => {
  res.clearCookie("auth_token", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  });

  res.clearCookie("user_role", {
    httpOnly: false,
    secure: true,
    sameSite: "lax",
    path: "/",
  });

  res.status(200).json({ message: "Logged out successfully" });
};
