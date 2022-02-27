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

import router from "./routes/index.js";
app.use("/", router);

app.listen(port, () => console.log(`Listening on port ${port}`));
