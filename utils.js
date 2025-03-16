const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports.createToken = (userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET_KEY);
  return token;
};
