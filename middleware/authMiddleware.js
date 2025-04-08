const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Add user data to request (now contains id, firstName, lastName)
    next();
  } catch {
    return res.sendStatus(403);
  }
};

module.exports = verifyToken;
