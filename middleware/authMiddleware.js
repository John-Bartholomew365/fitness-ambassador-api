const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const { token } = req.headers;

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ msg: "Invalid token" });
    }

    console.log("Decoded Token:", decoded);
    // Normalize to include _id for compatibility with controllers (e.g., req.user._id)
    req.user = {
      _id: decoded.userId || decoded.id,
      role: decoded.role,
      ...decoded
    };

    next();
  });
};

module.exports = authMiddleware;
