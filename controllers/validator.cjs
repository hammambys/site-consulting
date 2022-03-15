const { body } = require("express-validator");

exports.createUser = [
  body("email").isEmail(),
  body("password").isLength({ min: 5 }),
];

exports.formatDate = (date) => {
  const d = new Date(date);
  return date.getFullYear();
};
