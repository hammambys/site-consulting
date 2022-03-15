const mysql = require("mysql");

let connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

exports.viewAllRdv = (req, res) => {
  // User the connection
  connection.query("SELECT * FROM rendezvous", (err, rows) => {
    if (!err) {
      res.render("admin-view-rdv", { rows });
    } else {
      console.log(err);
    }
  });
};
exports.viewAllRdvOfClient = (req, res) => {
  connection.query(
    "SELECT * FROM rendezvous WHERE user_id=?",
    [req.params.id],
    (err, rows) => {
      if (!err) {
        res.render("client-view-rdv", { rows });
      } else {
        console.log(err);
      }
    }
  );
};

exports.createRdv = (req, res) => {
  const rdv_date = req.body["date-rdv"];
  connection.query(
    "INSERT INTO rendezvous(user_id,rdv_date) VALUES (? ,?)",
    [req.params.id, rdv_date],
    (err, rows) => {
      if (!err) {
        res.redirect("/client");
      } else {
        console.log(err);
      }
    }
  );
};

exports.deleteRdv = (req, res) => {
  connection.query(
    "DELETE FROM rendezvous WHERE rdv_id=?",
    [req.params.rdv_id],
    (err, rows) => {
      if (!err) {
        connection.query(
          "SELECT * FROM rendezvous WHERE user_id=?",
          [req.params.id],
          (err, rows) => {
            if (!err) {
              res.render("client-view-rdv", {
                rows,
                alert: "Rendez-vous annulé",
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
