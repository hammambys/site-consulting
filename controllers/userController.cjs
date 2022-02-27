const mysql = require("mysql");

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
      res.render("admin", { rows });
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
          res.redirect("/admin");
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

exports.register = (req, res, next) => {
  req.assert("name", "Name is required").notEmpty(); //Validate name
  req.assert("password", "Password is required").notEmpty(); //Validate password
  req.assert("email", "A valid email is required").isEmail(); //Validate email

  var errors = req.validationErrors();

  if (!errors) {
    //No errors were found.  Passed Validation!

    var user = {
      name: req.sanitize("name").escape().trim(),
      email: req.sanitize("email").escape().trim(),
      password: req.sanitize("password").escape().trim(),
    };

    connection.query("INSERT INTO users SET ?", user, function (err, result) {
      //if(err) throw err
      if (err) {
        req.flash("error", err);

        // render to views/user/add.ejs
        res.render("auth/register", {
          title: "Registration Page",
          name: "",
          password: "",
          email: "",
        });
      } else {
        req.flash("success", "You have successfully signup!");
        res.redirect("/login");
      }
    });
  } else {
    //Display errors to user
    var error_msg = "";
    errors.forEach(function (error) {
      error_msg += error.msg + "<br>";
    });
    req.flash("error", error_msg);

    /**
     * Using req.body.name
     * because req.param('name') is deprecated
     */
    res.render("auth/register", {
      title: "Registration Page",
      name: req.body.name,
      email: req.body.email,
      password: "",
    });
  }
};
