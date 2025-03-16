const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers ? req.headers.authorization : null;
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Auth token is required" });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    req.user = payload;
    next();
  });
};
