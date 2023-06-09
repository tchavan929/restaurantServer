const jwt = require("jsonwebtoken");
const config = process.env;
const verifyToken = (req, res, next) => {
  console.log(req.query.token)
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, "5eb3d668b31de5d588f4292c5eb3d668b31de5d588f4292c");
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};
module.exports = verifyToken;