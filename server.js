// These lines make "require" available
import { createRequire } from "module";
const require = createRequire(import.meta.url);

import { engine } from "express-handlebars";
import express from "express";
import "dotenv/config";
import { dirname } from "path";
import { fileURLToPath } from "url";
import router from "./routes/router.js";
import adminRouter from "./routes/adminRouter.js";
import clientRouter from "./routes/clientRouter.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
var session = require("express-session");

const port = process.env.PORT || 5000;
const app = express();

// Parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// Parse application/json
app.use(express.json());

// Static Files
app.use(express.static("public"));
app.use("/css", express.static(__dirname + "/public/css"));
app.use("/lib", express.static(__dirname + "/public/lib"));
app.use("/img", express.static(__dirname + "/public/img"));
app.use("/js", express.static(__dirname + "/public/js"));

// Templating Engine
app.engine("hbs", engine());
app.set("view engine", "hbs");
app.set("views", "./views");

// Open a session
var sess = {
  secret: "keyboard cat",
  cookie: {},
};
if (app.get("env") === "production") {
  app.set("trust proxy", 1); // trust first proxy
  sess.cookie.secure = true; // serve secure cookies
}
app.use(session(sess));

// Routes
app.use("/", router);
app.use("/admin", adminRouter);
app.use("/client", clientRouter);
app.use(function (req, res) {
  res.status(404);
  res.render("error", {
    status: 404,
    title: "Page non trouvé",
  });
});

// Start the server
app.listen(port, () => console.log(`Listening on port ${port}`));
