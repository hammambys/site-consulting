// These lines make "require" available
import { createRequire } from "module";
const require = createRequire(import.meta.url);

import express from "express";
var clientRouter = express.Router();
var rdvController = require("../controllers/rdvController.cjs");

clientRouter.get("/", (req, res) => {
  res.render("client-acceuil");
});
clientRouter.get("/:id/addrdv", (req, res) => {
  res.render("client-add-rdv");
});
clientRouter.post("/:id/addrdv", rdvController.createRdv);

clientRouter.get("/:id/viewrdv", rdvController.viewAllRdvOfClient);

clientRouter.get("/:id/:rdv_id", rdvController.deleteRdv);

export default clientRouter;
