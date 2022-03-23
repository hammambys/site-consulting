const mysql = require("mysql");

let connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

exports.viewArticle = (req, res) => {
  connection.query(
    "SELECT * FROM articles WHERE article_id=?",
    [req.params.id],
    (err, rows) => {
      if (!err) {
        const article_title = rows[0].article_title;
        const article_content = rows[0].article_content;
        const img_src = rows[0].img_src;
        res.render("article", {
          rows,
          isAdmin: req.session.isAdmin,
          loggedin: req.session.loggedin,
          username: req.session.username,
          article_title: article_title,
          article_content: article_content,
          img_src: img_src,
        });
      } else {
        console.log(err);
      }
    }
  );
};

exports.viewAllArticles = (req, res) => {
  connection.query("SELECT * FROM articles", (err, rows) => {
    if (!err) {
      res.render("articles", {
        rows,
        isAdmin: req.session.isAdmin,
        loggedin: req.session.loggedin,
        username: req.session.username,
      });
    } else {
      console.log(err);
    }
  });
};
exports.viewAll = (req, res) => {
  connection.query("SELECT * FROM articles", (err, rows) => {
    if (!err) {
      res.render("admin-view-articles", {
        rows,
        isAdmin: req.session.isAdmin,
        loggedin: req.session.loggedin,
        username: req.session.username,
      });
    } else {
      console.log(err);
    }
  });
};

exports.createArticle = (req, res) => {
  if (!req.file) {
    console.log("No file upload");
  }
  var img_src = "img/article-img/" + req.file.filename;
  const { article_title, article_content } = req.body;
  connection.query(
    "INSERT INTO articles SET article_title = ?, article_content = ?,img_src=?",
    [article_title, article_content, img_src],
    (err, rows) => {
      if (!err) {
        res.render("admin-add-article", {
          alert: "L'article est crée avec succés!.",
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

exports.createArticleform = (req, res) => {
  res.render("admin-add-article");
};

exports.editArticle = (req, res) => {
  connection.query(
    "SELECT * FROM articles WHERE article_id=?",
    [req.params.id],
    (err, rows) => {
      if (!err) {
        res.render("admin-edit-article", {
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

exports.updateArticle = (req, res) => {
  const { article_title, article_content } = req.body;
  connection.query(
    "UPDATE articles SET article_title=? ,article_content=? WHERE article_id=?",
    [article_title, article_content, req.params.id],
    (err, rows) => {
      if (!err) {
        connection.query(
          "SELECT * FROM articles WHERE article_id = ?",
          [req.params.id],
          (err, rows) => {
            if (!err) {
              res.render("admin-edit-article", {
                rows,
                alert: `L'article est mis à jour.`,
                isAdmin: req.session.isAdmin,
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
exports.deleteArticle = (req, res) => {
  connection.query(
    "DELETE FROM articles WHERE article_id=?",
    [req.params.id],
    (err, rows) => {
      if (!err) {
        connection.query("SELECT * FROM articles", (err, rows) => {
          if (!err) {
            res.render("admin-view-articles", {
              rows,
              alert: "Article supprimé",
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
