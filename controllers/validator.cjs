const { body } = require("express-validator");

exports.createUser = [
  body("email").isEmail(),
  body("password").isLength({ min: 5 }),
];

//body("email").isEmail()),
// password must be at least 5 chars long
//body("password").isLength({ min: 5 }),
