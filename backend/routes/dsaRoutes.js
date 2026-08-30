const express = require("express");
const pool = require("../db/db");

const router = express.Router();

router.get("/topics", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, slug FROM dsa_topics ORDER BY id",
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Failed to fetch DSA topics:", error);

    res.status(500).json({
      status: "error",
      message: "Failed to fetch DSA topics",
    });
  }
});

module.exports = router;