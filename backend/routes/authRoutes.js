const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db/db");
const authenticate = require("../middleware/authenticate");

const router = express.Router();
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function createSession(user) {
  return {
    token: jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    ),
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
}

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const normalizedName = typeof name === "string" ? name.trim() : "";
  const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

  if (!normalizedName || normalizedName.length > 100) {
    return res.status(400).json({
      status: "error",
      message: "Name must be between 1 and 100 characters",
    });
  }

  if (!EMAIL_PATTERN.test(normalizedEmail)) {
    return res.status(400).json({
      status: "error",
      message: "Enter a valid email address",
    });
  }

  if (typeof password !== "string" || password.length < 8) {
    return res.status(400).json({
      status: "error",
      message: "Password must contain at least 8 characters",
    });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 12);
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email`,
      [normalizedName, normalizedEmail, passwordHash],
    );

    res.status(201).json(createSession(result.rows[0]));
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        status: "error",
        message: "An account already exists for this email address",
      });
    }

    console.error("Failed to register user:", error);
    res.status(500).json({ status: "error", message: "Failed to create account" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

  if (!normalizedEmail || typeof password !== "string") {
    return res.status(400).json({
      status: "error",
      message: "Email and password are required",
    });
  }

  try {
    const result = await pool.query(
      "SELECT id, name, email, password_hash FROM users WHERE email = $1",
      [normalizedEmail],
    );
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({
        status: "error",
        message: "Email or password is incorrect",
      });
    }

    res.json(createSession(user));
  } catch (error) {
    console.error("Failed to sign in user:", error);
    res.status(500).json({ status: "error", message: "Failed to sign in" });
  }
});

router.get("/me", authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email FROM users WHERE id = $1",
      [req.user.id],
    );

    if (!result.rows[0]) {
      return res.status(404).json({ status: "error", message: "User not found" });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error("Failed to load user:", error);
    res.status(500).json({ status: "error", message: "Failed to load user" });
  }
});

module.exports = router;
