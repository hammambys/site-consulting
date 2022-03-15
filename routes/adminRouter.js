// These lines make "require" available
import { createRequire } from "module";
const require = createRequire(import.meta.url);
import express from "express";

var adminRouter = express.Router();
var rdvController = require("../controllers/rdvController.cjs");
var userController = require("../controllers/userController.cjs");
var articleController = require("../controllers/articleController.cjs");

adminRouter.get("/", (req, res) => {
  res.render("admin-acceuil");
});
adminRouter.get("/rdv", rdvController.viewAllRdv);
adminRouter.get("/clients", userController.viewAll);
adminRouter.get("/viewclient/:id", userController.viewClient);
adminRouter.get("/editclient/:id", userController.editClient);
adminRouter.post("/editclient/:id", userController.updateClient);
adminRouter.post("/clients/:id", userController.deleteClient);
adminRouter.get("/addarticle", articleController.form);
adminRouter.post("/addarticle", articleController.createArticle);

export default adminRouter;
