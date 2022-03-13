const moment = require("moment");
const mysql = require("mysql");
const permalink = require("permalinks");

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
exports.viewClient = (req, res) => {
  connection.query(
    "SELECT * from users WHERE user_id=?",
    [req.params.id],
    (err, rows) => {
      if (!err) {
        res.render("viewclient", {
          data: rows,
        });
      } else {
        console.log(err);
      }
    }
  );
};

exports.viewAllRdv = (req, res) => {
  // User the connection
  connection.query("SELECT * FROM appointments", (err, rows) => {
    rows.date = moment(rows.date).format("dddd");
    // When done with the connection, release it
    if (!err) {
      res.render("rdv", { rows });
    } else {
      console.log(err);
    }
  });
};

exports.login = (req, res) => {
  // Capture the input fields
  let email = req.body.email;
  let password = req.body.password;
  // Ensure the input fields exists and are not empty
  if (email && password) {
    // Execute SQL query that'll select the account from the database based on the specified username and password
    connection.query(
      "SELECT * FROM users WHERE email = ? AND password = ?",
      [email, password],
      function (error, results, fields) {
        if (error) throw error;
        // If the account exists
        if (results.length > 0) {
          // Authenticate the user
          req.session.loggedin = true;
          req.session.email = email;
          res.redirect("/clients");
        } else {
          res.send("Incorrect Username and/or Password!");
        }
        res.end();
      }
    );
  } else {
    res.send("Please enter Email and Password!");
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
