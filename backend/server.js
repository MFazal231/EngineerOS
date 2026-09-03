const express = require("express");
const cors = require("cors");
const pool = require("./db/db");
const dsaRoutes = require("./routes/dsaRoutes");

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(
  cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
  }),
);

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

app.use("/api/dsa", dsaRoutes);

app.listen(PORT, () => {
  console.log(
    `EngineerOS backend running at http://localhost:${PORT}`,
  );
});
