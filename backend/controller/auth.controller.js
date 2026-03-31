import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "./../utils/generateToken.js";

// Register User / Seller / Admin
export const register = async (req, res) => {
  try {
    const { name, email, password, phone, address, role } = req.body;

    // Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      role,
    });

    res.status(201).json({
      message: "User registered successfully",
      token: generateToken(user),
      user,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    res.json({
      message: "Login successful",
      token: generateToken(user),
      user,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Get Seller Profile
export const getSellerProfile = async (req, res) => {
  try {

    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json(user);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// Update Seller Profile
export const updateSellerProfile = async (req, res) => {

  try {

    const { name, phone, address, profilePic } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        name,
        phone,
        address,
        profilePic
      },
      { new: true }
    ).select("-password");

    res.json(user);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }

};



// ==========================
// Reset Password
// ==========================
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.json({
      message: "Password updated successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



export const getUserProfile = async (req, res) => {
  res.json(req.user);
};

export const updateUserProfile = async (req, res) => {
  try {
    const user = req.user;

    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.address = req.body.address || user.address;

    const updatedUser = await user.save();

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};