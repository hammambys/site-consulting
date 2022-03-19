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
      res.render("admin-view-clients", {
        rows,
        loggedin: req.session.loggedin,
        username: req.session.username,
      });
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
          loggedin: req.session.loggedin,
          username: req.session.username,
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
        res.render("edit-client", {
          rows,
          loggedin: req.session.loggedin,
          username: req.session.username,
        });
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
                loggedin: req.session.loggedin,
                username: req.session.username,
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

exports.activateClient = (req, res) => {
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
                      loggedin: req.session.loggedin,
                      username: req.session.username,
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
                      loggedin: req.session.loggedin,
                      username: req.session.username,
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
      (err, rows) => {
        if (err) throw err;
        // If the account exists
        if (rows.length > 0) {
          req.session.user_id = rows[0].user_id;
          req.session.username = rows[0].username;
          req.session.first_name = rows[0].first_name;
          req.session.isAdmin = rows[0].isAdmin;
          // Authenticate the user
          req.session.loggedin = true;
          req.session.email = email;
          if (!req.session.isAdmin) {
            res.redirect("/client/" + req.session.user_id);
          } else {
            res.redirect("/admin");
          }
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

  connection.query("INSERT INTO users SET ?", user, function (err, rows) {
    if (err) {
      console.log(err);
      res.render("register", {
        title: "Registration Page",
        name: "",
        password: "",
        email: "",
        loggedin: req.session.loggedin,
        username: req.session.username,
      });
    } else {
      console.log("success", "You have successfully signup!");
      res.redirect("/login");
    }
  });
};
