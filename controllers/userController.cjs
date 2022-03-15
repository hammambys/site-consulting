const mysql = require("mysql");

let connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

exports.viewAll = (req, res) => {
  connection.query("SELECT * FROM users", (err, rows) => {
    if (!err) {
      res.render("admin-view-clients", { rows });
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
        res.render("view-client", {
          data: rows,
        });
      } else {
        console.log(err);
      }
    }
  );
};

exports.editClient = (req, res) => {
  connection.query(
    "SELECT * FROM users WHERE user_id=?",
    [req.params.id],
    (err, rows) => {
      if (!err) {
        res.render("edit-client", { rows });
      } else {
        console.log(err);
      }
    }
  );
};

exports.updateClient = (req, res) => {
  const { first_name, last_name, username } = req.body;
  connection.query(
    "UPDATE users SET first_name=? ,last_name=?,username=? WHERE user_id=?",
    [first_name, last_name, username, req.params.id],
    (err, rows) => {
      if (!err) {
        connection.query(
          "SELECT * FROM users WHERE user_id = ?",
          [req.params.id],
          (err, rows) => {
            if (!err) {
              res.render("edit-client", {
                rows,
                alert: `${username} est mis à jour.`,
              });
            } else {
              console.log(err);
            }
          }
        );
      } else {
        console.log(err);
      }
    }
  );
};

exports.deleteClient = (req, res) => {
  connection.query(
    "select isActive from users where user_id=?",
    [req.params.id],
    (err, rows) => {
      if (!err) {
        if (!rows[0].isActive) {
          connection.query(
            "UPDATE users SET isActive=true WHERE user_id = ?",
            [req.params.id],
            (err, rows) => {
              if (!err) {
                connection.query("SELECT * FROM users", (err, rows) => {
                  if (!err) {
                    res.render("admin-view-clients", {
                      rows,
                      alert: "utilisateur activé avec succés",
                    });
                  } else {
                    console.log(err);
                  }
                });
              } else {
                console.log(err);
              }
            }
          );
        } else {
          connection.query(
            "UPDATE  users SET isActive=false WHERE user_id = ?",
            [req.params.id],
            (err, rows) => {
              if (!err) {
                connection.query("SELECT * FROM users", (err, rows) => {
                  if (!err) {
                    res.render("admin-view-clients", {
                      rows,
                      alert: "utilisateur désactivé avec succés",
                    });
                  } else {
                    console.log(err);
                  }
                });
              } else {
                console.log(err);
              }
            }
          );
        }
      } else {
        console.log(err);
      }
    }
  );
  const { isActive } = req.body;
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
