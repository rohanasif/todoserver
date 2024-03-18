import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import { validateEmail, validatePassword } from "../utils/validation.js";

// @desc    Register a new user
// @route   POST /api/v1/users
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Input validation
    if (!name || !email || !password) {
      res.status(400);
      throw new Error("All fields are required");
    }
    if (!validateEmail(email)) {
      res.status(400);
      throw new Error("Invalid email format");
    }
    if (!validatePassword(password)) {
      res.status(400);
      throw new Error(
        "Password should contain at least one uppercase letter, one lowercase letter, one number, and one special character, and should be at least 8 characters long."
      );
    }

    // Check if user already exists
    const exists = await User.findOne({ email: email });
    if (exists) {
      res.status(400);
      throw new Error("User already exists");
    }

    // Hash password
    const hashedPassword = bcryptjs.hashSync(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (user) {
      res.status(201);
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  } catch (error) {
    res.status(400);
    res.json({
      message: error.message,
    });
  }
});

// @desc    Login user
// @route   POST /api/v1/users/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    const match = bcryptjs.compareSync(password, user.password);

    if (match) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
  } catch (error) {
    res.status(400);
    res.json({
      message: error.message,
    });
  }
});

// @desc    Get current user
// @route   GET /api/users/me
// @access  Public
export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Signout the user
// @route   POST /api/v1/users/logout
// @access  Public
export const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("token");
  res.json({ message: "User signed out successfully" });
});

// @desc Get current user
// @route GET /api/users/me
// @access Private
export const getMe = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    res.status(400);
    res.json({
      message: error.message,
    });
  }
});

// @desc    Get user by ID
// @route   GET /api/v1/users/:id
// @access  Private/Admin
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Delete user
// @route   DELETE /api/v1/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.remove();
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});
