import { engine } from "express-handlebars";
import express from "express";
import "dotenv/config";
import router from "./routes/router.js";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

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

app.use("/", router);

app.listen(port, () => console.log(`Listening on port ${port}`));
