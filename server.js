import { engine } from "express-handlebars";
import express from "express";
import mysql from "mysql";
import "dotenv/config";
import router from "./routes/router.js";
import session from "express-session";

const port = process.env.PORT || 5000;
const app = express();

// create a seesion
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

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

app.use("/", router);

app.listen(port, () => console.log(`Listening on port ${port}`));
