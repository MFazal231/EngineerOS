const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
  const authorization = req.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return res.status(401).json({
      status: "error",
      message: "Authentication is required",
    });
  }

  try {
    req.user = jwt.verify(authorization.slice(7), process.env.JWT_SECRET);
    next();
  } catch (error) {
    res.status(401).json({
      status: "error",
      message: "Your session is invalid or has expired",
    });
  }
}

module.exports = authenticate;
