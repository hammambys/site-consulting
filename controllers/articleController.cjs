const mysql = require("mysql");

let connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

exports.viewAllArticles = (req, res) => {
  connection.query(
    "SELECT * FROM articles  ",

    (err, rows) => {
      if (!err) {
        res.render("articles", { rows });
      } else {
        console.log(err);
      }
    }
  );
};

exports.createArticle = (req, res) => {
  const { article_title, article_content } = req.body;
  connection.query(
    "INSERT INTO articles SET article_title = ?, article_content = ?",
    [article_title, article_content],
    (err, rows) => {
      if (!err) {
        res.render("add-article", {
          alert: "article added successfully.",
        });
      } else {
        console.log(err);
      }
      console.log("The data from user table: \n", rows);
    }
  );
};

exports.form = (req, res) => {
  res.render("add-article");
};
