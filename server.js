import { engine } from "express-handlebars";
import express from "express";
import mysql from "mysql";
import "dotenv/config";

const port = process.env.PORT || 5000;
const app = express();

// Parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Parse application/json
app.use(express.json());

// Static Files
app.use(express.static("public"));

// Templating Engine
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

let connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

app.get("/", (req, res) => {
  res.render("home");
});
app.get("/about", (req, res) => {
  res.render("about");
});
app.get("/mission", (req, res) => {
  res.render("mission");
});
app.get("/articles", (req, res) => {
  res.render("articles");
});
app.get("/projets", (req, res) => {
  res.render("projets");
});
app.get("/contact", (req, res) => {
  res.render("contact");
});

app.listen(port, () => console.log(`Listening on port ${port}`));
