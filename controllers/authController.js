const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Generate tokens
const generateTokens = (user) => {
  // Access token (short lived)
  const accessToken = jwt.sign(
    {
      id: user._id,
      user: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  // Refresh token (longer lived)
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

// Set refresh token as HTTP-only cookie
const setRefreshTokenCookie = (res, token) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // HTTPS only in production
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
  });
};

// Register a new user
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      password
    });

    await user.save();

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Set refresh token cookie
    setRefreshTokenCookie(res, refreshToken);

    // Return user data and access token
    res.status(201).json({
      accessToken,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Set refresh token cookie
    setRefreshTokenCookie(res, refreshToken);

    // Return user data and access token
    res.json({
      accessToken,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

// Refresh token
exports.refresh = async (req, res) => {
  try {
    // Get refresh token from cookie
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token not found" });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Get user
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // Generate new access token
    const accessToken = jwt.sign(
      { id: user._id, firstName: user.firstName, lastName: user.lastName },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // Return new access token
    res.json({ accessToken });
  } catch (error) {
    console.error("Refresh error:", error);
    res.status(403).json({ message: "Invalid refresh token" });
  }
};

// Logout user
exports.logout = (req, res) => {
  // Clear refresh token cookie
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully" });
};

// Get current user
exports.me = async (req, res) => {
  try {
    // User data is already in req.user from the auth middleware
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Server error getting user data" });
  }
};
