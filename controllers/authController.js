import User from "../models/user.js";
import Profile from "../models/profile.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* ======================
   COOKIE OPTIONS
====================== */
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: "/",
};

/* ======================
   REGISTER
====================== */
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // First user becomes admin
    const usersCount = await User.countDocuments();
    const role = usersCount === 0 ? "admin" : "user";

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await Profile.create({ user: user._id });

    // Create token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_TOKEN_EXPIRY }
    );

    // Set cookies
    res.cookie("auth_token", token, cookieOptions);
    res.cookie("user_role", user.role, cookieOptions);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Registration failed" });
  }
};

/* ======================
   LOGIN
====================== */
export const login = async (req, res) => {
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

    // Create token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_TOKEN_EXPIRY }
    );

    // Set cookies
    res.cookie("auth_token", token, cookieOptions);
    res.cookie("user_role", user.role, cookieOptions);

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
};

/* ======================
   GET CURRENT USER
====================== */
export const me = async (req, res) => {
  try {
    const user = await User.findById(req.userData.userId)
      .select("name email role");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user" });
  }
};

/* ======================
   LOGOUT
====================== */
export const logout = (req, res) => {
  res.clearCookie("auth_token", cookieOptions);
  res.clearCookie("user_role", cookieOptions);

  res.status(200).json({ message: "Logged out successfully" });
};
