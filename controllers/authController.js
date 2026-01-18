import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Profile from "../models/profile.js";

/*REGISTER*/
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const usersCount = await User.countDocuments();
    const role = usersCount === 0 ? "admin" : "user";

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await Profile.create({ user: user._id });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_TOKEN_EXPIRY }
    );

    // ✅ SET COOKIE (JS readable)
    res.cookie("auth_token", token, {
      httpOnly: false, // allow JS access
      secure: true, // only HTTPS
      sameSite: "None", // allow cross-site
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

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
    res
      .status(500)
      .json({ message: "Registration failed", error: error.message });
  }
};

/*LOGIN*/
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    console.log("USER ROLE:", user.role);


    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_TOKEN_EXPIRY }
    );

    // ✅ SET COOKIE (JS readable)
    res.cookie("auth_token", token, {
      httpOnly: false, // allow JS access
      secure: true, // only HTTPS
      sameSite: "None", // allow cross-site
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

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
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

/* ======================
   GET CURRENT USER
====================== */
export const me = async (req, res) => {
  try {
    const user = await User.findById(req.userData.userId).select(
      "name email role"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Failed to get user info" });
  }
};

/* ======================
   LOGOUT
====================== */
export const logout = (req, res) => {
  res.clearCookie("auth_token", {
    httpOnly: false,
    secure: true,
    sameSite: "None",
    path: "/",
  });

  res.status(200).json({ message: "Logged out successfully" });
};
