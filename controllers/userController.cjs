const mysql = require("mysql");
const { validationResult } = require("express-validator");

let connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// View Users
exports.viewAll = (req, res) => {
  // User the connection
  connection.query("SELECT * FROM users", (err, rows) => {
    // When done with the connection, release it
    if (!err) {
      res.render("clients", { rows });
    } else {
      console.log(err);
    }
  });
};

exports.login = (req, res) => {
  // Capture the input fields
  let username = req.body.username;
  let password = req.body.password;
  // Ensure the input fields exists and are not empty
  if (username && password) {
    // Execute SQL query that'll select the account from the database based on the specified username and password
    connection.query(
      "SELECT * FROM users WHERE username = ? AND password = ?",
      [username, password],
      function (error, results, fields) {
        // If there is an issue with the query, output the error
        if (error) throw error;
        // If the account exists
        if (results.length > 0) {
          // Authenticate the user
          req.session.loggedin = true;
          req.session.username = username;
          // Redirect to home page
          res.redirect("/clients");
        } else {
          res.send("Incorrect Username and/or Password!");
        }
        res.end();
      }
    );
  } else {
    res.send("Please enter Username and Password!");
    res.end();
  }
};

exports.register = (req, res) => {
  console.log(req.body);
  var user = {
    first_name: req.body.fname,
    last_name: req.body.lname,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  };

  connection.query("INSERT INTO users SET ?", user, function (err, result) {
    if (err) {
      console.log(err);
      res.render("register", {
        title: "Registration Page",
        name: "",
        password: "",
        email: "",
      });
    } else {
      console.log("success", "You have successfully signup!");
      res.redirect("/login");
    }
  });
};
