const mysql = require("mysql");

let connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

function formatdate(item) {
  var newDate = new Date(item.rdv_date).toLocaleDateString("fr");
  var newTime = item.rdv_date.toLocaleTimeString("fr");
  item.rdv_date = newDate;
  item.rdv_heure = newTime.slice(0, -3);
}

exports.viewAllRdv = (req, res) => {
  // User the connection
  connection.query(
    "SELECT * FROM rendezvous r, users u WHERE r.user_id=u.user_id",
    (err, rows) => {
      if (!err) {
        rows.map(formatdate);
        res.render("admin-view-rdv", {
          rows,
          isAdmin: req.session.isAdmin,
          loggedin: req.session.loggedin,
          username: req.session.username,
        });
      } else {
        console.log(err);
      }
    }
  );
};

exports.viewAllRdvOfClient = (req, res) => {
  connection.query(
    "SELECT * FROM rendezvous WHERE user_id=?",
    [req.session.user_id],
    (err, rows) => {
      if (!err) {
        rows.map(formatdate);
        res.render("client-view-rdv", {
          rows,
          user_id: req.session.user_id,
          loggedin: req.session.loggedin,
          username: req.session.username,
        });
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
    [req.session.user_id, rdv_date],
    (err, rows) => {
      if (!err) {
        connection.query("SELECT * FROM rendezvous", (err, rows) => {
          if (!err) {
            res.render("client-add-rdv", {
              alert: "Rendezvous ajouté avec succés",
              user_id: req.session.user_id,
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
};

exports.cancelRdvClient = (req, res) => {
  const rdv_id = parseInt(req.params.rdv_id);
  connection.query(
    "DELETE FROM rendezvous WHERE user_id=? AND rdv_id=?",
    [req.session.user_id, rdv_id],
    (err, rows) => {
      if (!err) {
        connection.query(
          "SELECT * FROM rendezvous WHERE user_id=?",
          [req.params.id],
          (err, rows) => {
            if (!err) {
              rows.map(formatdate);
              res.render("client-view-rdv", {
                rows,
                alert: "Rendez-vous annulé",
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

exports.cancelRdvAdmin = (req, res) => {
  const rdv_id = parseInt(req.params.rdv_id);
  connection.query(
    "DELETE FROM rendezvous WHERE rdv_id=?",
    [rdv_id],
    (err, rows) => {
      if (!err) {
        connection.query("SELECT * FROM rendezvous", (err, rows) => {
          if (!err) {
            rows.map(formatdate);
            res.render("admin-view-rdv", {
              rows,
              alert: "Rendez-vous annulé",
              isAdmin: req.session.isAdmin,
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
};
