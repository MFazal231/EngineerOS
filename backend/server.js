const express = require("express");
const pool = require("./db/db");

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/api/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      status: "ok",
      message: "EngineerOS backend is running",
      databaseTime: result.rows[0].now,
    });
  } catch (error) {
    console.error("Database connection failed:", error);

    res.status(500).json({
      status: "error",
      message: "Database connection failed",
    });
  }
});

app.listen(PORT, () => {
  console.log(
    `EngineerOS backend running at http://localhost:${PORT}`,
  );
});