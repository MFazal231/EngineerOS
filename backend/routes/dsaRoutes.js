const express = require("express");
const pool = require("../db/db");
const authenticate = require("../middleware/authenticate");

const router = express.Router();
const validProblemStatuses = new Set([
  "not-started",
  "in-progress",
  "solved",
]);

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

router.get("/:topicSlug/progress", authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT problem_id AS "problemId", status
       FROM dsa_problem_progress
       WHERE topic_slug = $1 AND user_id = $2
       ORDER BY problem_id`,
      [req.params.topicSlug, req.user.id],
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Failed to fetch DSA progress:", error);

    res.status(500).json({
      status: "error",
      message: "Failed to fetch DSA progress",
    });
  }
});

router.put("/:topicSlug/problems/:problemId/status", authenticate, async (req, res) => {
  const problemId = Number(req.params.problemId);
  const { status } = req.body;

  if (!Number.isInteger(problemId) || problemId < 1) {
    return res.status(400).json({
      status: "error",
      message: "Problem ID must be a positive integer",
    });
  }

  if (!validProblemStatuses.has(status)) {
    return res.status(400).json({
      status: "error",
      message: "Invalid problem status",
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO dsa_problem_progress (user_id, topic_slug, problem_id, status)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, topic_slug, problem_id)
       DO UPDATE SET status = EXCLUDED.status, updated_at = CURRENT_TIMESTAMP
       RETURNING topic_slug AS "topicSlug", problem_id AS "problemId", status, updated_at AS "updatedAt"`,
      [req.user.id, req.params.topicSlug, problemId, status],
    );

    res.json(result.rows[0]);
  } catch (error) {
    if (error.code === "23503") {
      return res.status(404).json({
        status: "error",
        message: "DSA topic not found",
      });
    }

    console.error("Failed to save DSA progress:", error);

    res.status(500).json({
      status: "error",
      message: "Failed to save DSA progress",
    });
  }
});

module.exports = router;
